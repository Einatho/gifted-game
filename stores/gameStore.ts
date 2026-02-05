import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Question,
  QuestionCategory,
  UserProgress,
  GameState,
  AnswerRecord,
  Achievement,
} from '@/utils/types';
import { INITIAL_PROGRESS, SCORING, ACHIEVEMENTS, LEVEL_CONFIGS } from '@/utils/constants';

interface GameStore {
  // User Progress
  progress: UserProgress;
  
  // Current Game Session
  currentCategory: QuestionCategory | null;
  currentLevel: number;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  gameState: GameState;
  
  // Actions - Progress
  updateProgress: (update: Partial<UserProgress>) => void;
  addPoints: (points: number) => void;
  addStars: (stars: number) => void;
  unlockLevel: (category: QuestionCategory, level: number) => void;
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
  
  // Actions - Game Session
  startGame: (category: QuestionCategory, level: number, questions: Question[]) => void;
  answerQuestion: (selectedAnswer: number, timeSpent: number) => { isCorrect: boolean; pointsEarned: number; starsEarned: number };
  nextQuestion: () => void;
  endGame: () => { totalPoints: number; totalStars: number; accuracy: number };
  resetGame: () => void;
  
  // Actions - Daily Challenge
  updateDailyStreak: () => void;
}

const calculateStars = (timeSpent: number, timeLimit: number): number => {
  const timeRatio = 1 - (timeSpent / timeLimit);
  if (timeRatio >= SCORING.STARS.THREE_STAR_THRESHOLD) return 3;
  if (timeRatio >= SCORING.STARS.TWO_STAR_THRESHOLD) return 2;
  return 1;
};

const calculatePoints = (basePoints: number, timeSpent: number, timeLimit: number, streakCount: number): number => {
  const timeRatio = 1 - (timeSpent / timeLimit);
  let points = basePoints;
  
  // Time bonus
  if (timeRatio >= SCORING.TIME_BONUS_THRESHOLD) {
    points *= SCORING.TIME_BONUS_MULTIPLIER;
  }
  
  // Streak bonus
  const streakBonus = Math.min(streakCount * SCORING.STREAK_BONUS, SCORING.MAX_STREAK_BONUS);
  points += streakBonus;
  
  return Math.round(points);
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      progress: INITIAL_PROGRESS as UserProgress,
      currentCategory: null,
      currentLevel: 1,
      currentQuestions: [],
      currentQuestionIndex: 0,
      gameState: {
        currentQuestion: 0,
        score: 0,
        stars: 0,
        timeRemaining: 0,
        answers: [],
        isComplete: false,
      },
      
      // Progress Actions
      updateProgress: (update) => set((state) => ({
        progress: { ...state.progress, ...update },
      })),
      
      addPoints: (points) => set((state) => ({
        progress: {
          ...state.progress,
          totalPoints: state.progress.totalPoints + points,
        },
      })),
      
      addStars: (stars) => set((state) => ({
        progress: {
          ...state.progress,
          totalStars: state.progress.totalStars + stars,
        },
      })),
      
      unlockLevel: (category, level) => set((state) => {
        const categoryProgress = state.progress.categoryProgress[category];
        if (categoryProgress.unlockedLevels.includes(level)) return state;
        
        return {
          progress: {
            ...state.progress,
            categoryProgress: {
              ...state.progress.categoryProgress,
              [category]: {
                ...categoryProgress,
                unlockedLevels: [...categoryProgress.unlockedLevels, level],
              },
            },
          },
        };
      }),
      
      unlockAchievement: (achievementId) => set((state) => {
        const existingAchievement = state.progress.achievements.find(a => a.id === achievementId);
        if (existingAchievement?.unlockedAt) return state;
        
        const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievementDef) return state;
        
        const newAchievement: Achievement = {
          ...achievementDef,
          unlockedAt: new Date().toISOString(),
        };
        
        return {
          progress: {
            ...state.progress,
            achievements: [
              ...state.progress.achievements.filter(a => a.id !== achievementId),
              newAchievement,
            ],
          },
        };
      }),
      
      checkAchievements: () => {
        const state = get();
        const { progress } = state;
        
        // First Steps
        if (progress.correctAnswers >= 1) {
          get().unlockAchievement('first_steps');
        }
        
        // Category masters
        if (progress.categoryProgress.math.correctAnswers >= 10) {
          get().unlockAchievement('math_master_10');
        }
        if (progress.categoryProgress.verbal.correctAnswers >= 10) {
          get().unlockAchievement('verbal_master_10');
        }
        if (progress.categoryProgress.visual.correctAnswers >= 10) {
          get().unlockAchievement('visual_master_10');
        }
        if (progress.categoryProgress.logic.correctAnswers >= 10) {
          get().unlockAchievement('logic_master_10');
        }
        
        // Star collector
        if (progress.totalStars >= 50) {
          get().unlockAchievement('star_collector_50');
        }
        
        // Daily streak
        if (progress.dailyChallengeStreak >= 7) {
          get().unlockAchievement('daily_streak_7');
        }
      },
      
      // Game Session Actions
      startGame: (category, level, questions) => set({
        currentCategory: category,
        currentLevel: level,
        currentQuestions: questions,
        currentQuestionIndex: 0,
        gameState: {
          currentQuestion: 0,
          score: 0,
          stars: 0,
          timeRemaining: LEVEL_CONFIGS[level - 1]?.timeLimit || 60,
          answers: [],
          isComplete: false,
        },
      }),
      
      answerQuestion: (selectedAnswer, timeSpent) => {
        const state = get();
        const currentQuestion = state.currentQuestions[state.currentQuestionIndex];
        
        if (!currentQuestion) {
          return { isCorrect: false, pointsEarned: 0, starsEarned: 0 };
        }
        
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const starsEarned = isCorrect ? calculateStars(timeSpent, currentQuestion.timeLimit) : 0;
        
        // Calculate streak
        const recentAnswers = state.gameState.answers.slice(-4);
        const streakCount = isCorrect 
          ? recentAnswers.filter(a => a.isCorrect).length + 1
          : 0;
        
        const pointsEarned = isCorrect 
          ? calculatePoints(currentQuestion.points, timeSpent, currentQuestion.timeLimit, streakCount)
          : 0;
        
        const answerRecord: AnswerRecord = {
          questionId: currentQuestion.id,
          selectedAnswer,
          isCorrect,
          timeSpent,
          pointsEarned,
          starsEarned,
        };
        
        set((state) => ({
          gameState: {
            ...state.gameState,
            score: state.gameState.score + pointsEarned,
            stars: state.gameState.stars + starsEarned,
            answers: [...state.gameState.answers, answerRecord],
          },
          progress: {
            ...state.progress,
            questionsAnswered: state.progress.questionsAnswered + 1,
            correctAnswers: state.progress.correctAnswers + (isCorrect ? 1 : 0),
            totalPoints: state.progress.totalPoints + pointsEarned,
            totalStars: state.progress.totalStars + starsEarned,
            categoryProgress: state.currentCategory ? {
              ...state.progress.categoryProgress,
              [state.currentCategory]: {
                ...state.progress.categoryProgress[state.currentCategory],
                questionsCompleted: state.progress.categoryProgress[state.currentCategory].questionsCompleted + 1,
                correctAnswers: state.progress.categoryProgress[state.currentCategory].correctAnswers + (isCorrect ? 1 : 0),
                starsEarned: state.progress.categoryProgress[state.currentCategory].starsEarned + starsEarned,
              },
            } : state.progress.categoryProgress,
          },
        }));
        
        // Check achievements after answering
        get().checkAchievements();
        
        return { isCorrect, pointsEarned, starsEarned };
      },
      
      nextQuestion: () => set((state) => {
        const nextIndex = state.currentQuestionIndex + 1;
        const isComplete = nextIndex >= state.currentQuestions.length;
        
        return {
          currentQuestionIndex: nextIndex,
          gameState: {
            ...state.gameState,
            currentQuestion: nextIndex,
            isComplete,
          },
        };
      }),
      
      endGame: () => {
        const state = get();
        const { gameState, currentCategory, currentLevel, progress } = state;
        
        const accuracy = gameState.answers.length > 0
          ? gameState.answers.filter(a => a.isCorrect).length / gameState.answers.length
          : 0;
        
        // Check for level completion and unlock next level
        if (accuracy >= 0.7 && currentCategory && currentLevel < 10) {
          const nextLevel = currentLevel + 1;
          const levelConfig = LEVEL_CONFIGS[nextLevel - 1];
          if (levelConfig && progress.categoryProgress[currentCategory].starsEarned >= levelConfig.requiredStars) {
            get().unlockLevel(currentCategory, nextLevel);
          }
        }
        
        // Check for perfect score achievement
        if (accuracy === 1) {
          get().unlockAchievement('perfect_level');
        }
        
        // Update best score
        if (currentCategory) {
          const categoryProgress = progress.categoryProgress[currentCategory];
          if (gameState.score > categoryProgress.bestScore) {
            set((state) => ({
              progress: {
                ...state.progress,
                categoryProgress: {
                  ...state.progress.categoryProgress,
                  [currentCategory]: {
                    ...categoryProgress,
                    bestScore: gameState.score,
                  },
                },
              },
            }));
          }
        }
        
        return {
          totalPoints: gameState.score,
          totalStars: gameState.stars,
          accuracy,
        };
      },
      
      resetGame: () => set({
        currentCategory: null,
        currentLevel: 1,
        currentQuestions: [],
        currentQuestionIndex: 0,
        gameState: {
          currentQuestion: 0,
          score: 0,
          stars: 0,
          timeRemaining: 0,
          answers: [],
          isComplete: false,
        },
      }),
      
      updateDailyStreak: () => set((state) => {
        const today = new Date().toDateString();
        const lastPlayed = state.progress.lastPlayedDate;
        
        if (lastPlayed === today) return state;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = lastPlayed === yesterday.toDateString();
        
        return {
          progress: {
            ...state.progress,
            dailyChallengeStreak: wasYesterday ? state.progress.dailyChallengeStreak + 1 : 1,
            lastPlayedDate: today,
          },
        };
      }),
    }),
    {
      name: 'gifted-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);

