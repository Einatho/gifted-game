// Question Types
export type QuestionCategory = 'math' | 'verbal' | 'visual' | 'logic';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BaseQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  timeLimit: number; // seconds
  points: number;
  hint?: string;
}

export interface MathQuestion extends BaseQuestion {
  category: 'math';
  type: 'sequence' | 'arithmetic' | 'word_problem';
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct option
  sequence?: number[]; // for sequence questions
}

export interface VerbalQuestion extends BaseQuestion {
  category: 'verbal';
  type: 'analogy' | 'category' | 'opposite' | 'similar';
  questionText: string;
  pair: [string, string];
  options: [string, string][];
  correctAnswer: number;
}

export interface VisualQuestion extends BaseQuestion {
  category: 'visual';
  type: 'sequence' | 'matrix' | 'rotation' | 'pattern';
  questionText: string;
  shapes: Shape[];
  options: Shape[][];
  correctAnswer: number;
}

export interface LogicQuestion extends BaseQuestion {
  category: 'logic';
  type: 'deduction' | 'if_then' | 'set_membership' | 'ordering' | 'puzzle';
  questionText: string;
  statements?: string[];
  options: string[];
  correctAnswer: number;
}

export type Question = MathQuestion | VerbalQuestion | VisualQuestion | LogicQuestion;

// Shape definitions for visual questions
export interface Shape {
  type: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon' | 'diamond';
  color: string;
  size: 'small' | 'medium' | 'large';
  rotation?: number;
  filled?: boolean;
}

// Game State
export interface GameState {
  currentQuestion: number;
  score: number;
  stars: number;
  timeRemaining: number;
  answers: AnswerRecord[];
  isComplete: boolean;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
  starsEarned: number;
}

// User Progress
export interface UserProgress {
  totalPoints: number;
  totalStars: number;
  questionsAnswered: number;
  correctAnswers: number;
  categoryProgress: Record<QuestionCategory, CategoryProgress>;
  achievements: Achievement[];
  dailyChallengeStreak: number;
  lastPlayedDate: string;
}

export interface CategoryProgress {
  currentLevel: number;
  questionsCompleted: number;
  correctAnswers: number;
  bestScore: number;
  starsEarned: number;
  unlockedLevels: number[];
}

export interface Achievement {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Level Configuration
export interface LevelConfig {
  level: number;
  questionsCount: number;
  difficulty: Difficulty;
  timeLimit: number;
  requiredStars: number;
  rewards: {
    points: number;
    stars: number;
  };
}

// Game Session
export interface GameSession {
  category: QuestionCategory;
  level: number;
  questions: Question[];
  currentIndex: number;
  state: GameState;
  startTime: number;
}

