import { Difficulty, QuestionCategory, UserProgress } from './types';
import { LEVEL_CONFIGS } from './constants';

interface PerformanceMetrics {
  recentAccuracy: number;
  averageTimeRatio: number;
  streakCount: number;
  totalQuestionsInSession: number;
}

// Calculate the recommended difficulty based on user performance
export function getRecommendedDifficulty(
  progress: UserProgress,
  category: QuestionCategory,
  recentPerformance?: PerformanceMetrics
): Difficulty {
  const categoryProgress = progress.categoryProgress[category];
  const level = categoryProgress.currentLevel;
  const baseConfig = LEVEL_CONFIGS[level - 1];
  
  if (!baseConfig) return 'easy';
  
  const baseDifficulty = baseConfig.difficulty;
  
  // If no recent performance data, use base difficulty
  if (!recentPerformance) {
    return baseDifficulty;
  }
  
  const { recentAccuracy, averageTimeRatio, streakCount } = recentPerformance;
  
  // Adaptive rules
  // If doing very well (high accuracy + fast), consider harder questions
  if (recentAccuracy >= 0.9 && averageTimeRatio <= 0.5 && streakCount >= 3) {
    return increaseDifficulty(baseDifficulty);
  }
  
  // If struggling (low accuracy), consider easier questions
  if (recentAccuracy < 0.5 && recentPerformance.totalQuestionsInSession >= 3) {
    return decreaseDifficulty(baseDifficulty);
  }
  
  return baseDifficulty;
}

function increaseDifficulty(current: Difficulty): Difficulty {
  if (current === 'easy') return 'medium';
  if (current === 'medium') return 'hard';
  return 'hard';
}

function decreaseDifficulty(current: Difficulty): Difficulty {
  if (current === 'hard') return 'medium';
  if (current === 'medium') return 'easy';
  return 'easy';
}

// Calculate performance metrics from recent answers
export function calculatePerformanceMetrics(
  answers: Array<{
    isCorrect: boolean;
    timeSpent: number;
    timeLimit: number;
  }>
): PerformanceMetrics {
  if (answers.length === 0) {
    return {
      recentAccuracy: 0,
      averageTimeRatio: 1,
      streakCount: 0,
      totalQuestionsInSession: 0,
    };
  }
  
  // Use last 5 answers for recent performance
  const recentAnswers = answers.slice(-5);
  
  const correctCount = recentAnswers.filter(a => a.isCorrect).length;
  const recentAccuracy = correctCount / recentAnswers.length;
  
  const avgTimeRatio = recentAnswers.reduce((sum, a) => 
    sum + (a.timeSpent / a.timeLimit), 0) / recentAnswers.length;
  
  // Calculate current streak
  let streakCount = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].isCorrect) {
      streakCount++;
    } else {
      break;
    }
  }
  
  return {
    recentAccuracy,
    averageTimeRatio: Math.min(avgTimeRatio, 1),
    streakCount,
    totalQuestionsInSession: answers.length,
  };
}

// Get time bonus multiplier based on speed
export function getTimeBonusMultiplier(timeSpent: number, timeLimit: number): number {
  const ratio = timeSpent / timeLimit;
  
  if (ratio <= 0.2) return 2.0;     // Very fast: double points
  if (ratio <= 0.4) return 1.5;     // Fast: 50% bonus
  if (ratio <= 0.6) return 1.25;    // Good: 25% bonus
  if (ratio <= 0.8) return 1.0;     // Normal: no bonus
  return 0.75;                        // Slow: slight penalty
}

// Suggest next level based on performance
export function shouldUnlockNextLevel(
  accuracy: number,
  starsEarned: number,
  currentLevel: number,
  category: QuestionCategory,
  totalCategoryStars: number
): boolean {
  if (currentLevel >= 10) return false;
  
  const nextLevelConfig = LEVEL_CONFIGS[currentLevel]; // 0-indexed, so currentLevel gives next
  if (!nextLevelConfig) return false;
  
  // Need at least 70% accuracy and enough total stars
  return accuracy >= 0.7 && totalCategoryStars >= nextLevelConfig.requiredStars;
}

// Get encouragement message based on performance
export function getEncouragementMessage(accuracy: number, isHebrew: boolean = true): string {
  if (isHebrew) {
    if (accuracy >= 0.9) return 'מדהים! 🌟 אתה גאון!';
    if (accuracy >= 0.8) return 'מעולה! 🎉 המשך כך!';
    if (accuracy >= 0.7) return 'יפה מאוד! 👏 עבודה טובה!';
    if (accuracy >= 0.5) return 'טוב! 💪 נסה להשתפר!';
    return 'אל תתייאש! 🌈 תרגול עושה מושלם!';
  }
  
  if (accuracy >= 0.9) return 'Amazing! 🌟 You\'re a genius!';
  if (accuracy >= 0.8) return 'Excellent! 🎉 Keep it up!';
  if (accuracy >= 0.7) return 'Very good! 👏 Nice work!';
  if (accuracy >= 0.5) return 'Good! 💪 Try to improve!';
  return 'Don\'t give up! 🌈 Practice makes perfect!';
}

