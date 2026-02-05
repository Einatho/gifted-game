import { QuestionCategory, Difficulty, LevelConfig, Achievement } from './types';

// Category Information
export const CATEGORY_INFO: Record<QuestionCategory, {
  name: string;
  nameHe: string;
  icon: string;
  color: string;
  description: string;
  descriptionHe: string;
}> = {
  math: {
    name: 'Mathematical Reasoning',
    nameHe: 'חשיבה מתמטית',
    icon: 'calculator',
    color: '#3b82f6',
    description: 'Number sequences and arithmetic puzzles',
    descriptionHe: 'סדרות מספרים וחידות חישוב',
  },
  verbal: {
    name: 'Verbal Analogies',
    nameHe: 'אנלוגיות מילוליות',
    icon: 'book-open',
    color: '#8b5cf6',
    description: 'Word relationships and categories',
    descriptionHe: 'קשרי מילים וקטגוריות',
  },
  visual: {
    name: 'Visual Patterns',
    nameHe: 'דפוסים חזותיים',
    icon: 'shapes',
    color: '#f97316',
    description: 'Shape sequences and patterns',
    descriptionHe: 'סדרות צורות ודפוסים',
  },
  logic: {
    name: 'Logic Puzzles',
    nameHe: 'חידות היגיון',
    icon: 'lightbulb',
    color: '#10b981',
    description: 'Deduction and reasoning',
    descriptionHe: 'הסקה והיגיון',
  },
};

// Difficulty Settings
export const DIFFICULTY_SETTINGS: Record<Difficulty, {
  timeMultiplier: number;
  pointsMultiplier: number;
  hintPenalty: number;
}> = {
  easy: {
    timeMultiplier: 1.5,
    pointsMultiplier: 1,
    hintPenalty: 0.25,
  },
  medium: {
    timeMultiplier: 1,
    pointsMultiplier: 1.5,
    hintPenalty: 0.3,
  },
  hard: {
    timeMultiplier: 0.75,
    pointsMultiplier: 2,
    hintPenalty: 0.4,
  },
};

// Level Configurations - Progressive difficulty (all levels unlocked)
export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, questionsCount: 4, difficulty: 'easy', timeLimit: 60, requiredStars: 0, rewards: { points: 100, stars: 3 } },
  { level: 2, questionsCount: 5, difficulty: 'medium', timeLimit: 55, requiredStars: 0, rewards: { points: 150, stars: 3 } },
  { level: 3, questionsCount: 5, difficulty: 'medium', timeLimit: 50, requiredStars: 0, rewards: { points: 200, stars: 4 } },
  { level: 4, questionsCount: 6, difficulty: 'medium', timeLimit: 45, requiredStars: 0, rewards: { points: 300, stars: 4 } },
  { level: 5, questionsCount: 6, difficulty: 'hard', timeLimit: 45, requiredStars: 0, rewards: { points: 400, stars: 5 } },
  { level: 6, questionsCount: 7, difficulty: 'hard', timeLimit: 40, requiredStars: 0, rewards: { points: 500, stars: 5 } },
  { level: 7, questionsCount: 7, difficulty: 'hard', timeLimit: 35, requiredStars: 0, rewards: { points: 600, stars: 6 } },
  { level: 8, questionsCount: 8, difficulty: 'hard', timeLimit: 35, requiredStars: 0, rewards: { points: 750, stars: 6 } },
  { level: 9, questionsCount: 8, difficulty: 'hard', timeLimit: 30, requiredStars: 0, rewards: { points: 900, stars: 7 } },
  { level: 10, questionsCount: 10, difficulty: 'hard', timeLimit: 25, requiredStars: 0, rewards: { points: 1000, stars: 10 } },
];

// Scoring Constants
export const SCORING = {
  BASE_POINTS: 100,
  TIME_BONUS_THRESHOLD: 0.5, // 50% time remaining for bonus
  TIME_BONUS_MULTIPLIER: 1.5,
  STREAK_BONUS: 10, // points per correct streak
  MAX_STREAK_BONUS: 50,
  STARS: {
    THREE_STAR_THRESHOLD: 0.8, // 80% time remaining
    TWO_STAR_THRESHOLD: 0.5, // 50% time remaining
    ONE_STAR_THRESHOLD: 0, // any correct answer
  },
};

// Achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    nameHe: 'צעדים ראשונים',
    description: 'Answer your first question correctly',
    descriptionHe: 'ענה נכון על השאלה הראשונה',
    icon: 'star',
    target: 1,
  },
  {
    id: 'math_master_10',
    name: 'Math Apprentice',
    nameHe: 'חניך מתמטיקה',
    description: 'Answer 10 math questions correctly',
    descriptionHe: 'ענה נכון על 10 שאלות מתמטיות',
    icon: 'calculator',
    target: 10,
  },
  {
    id: 'verbal_master_10',
    name: 'Word Wizard',
    nameHe: 'קוסם מילים',
    description: 'Answer 10 verbal questions correctly',
    descriptionHe: 'ענה נכון על 10 שאלות מילוליות',
    icon: 'book',
    target: 10,
  },
  {
    id: 'visual_master_10',
    name: 'Pattern Seeker',
    nameHe: 'מוצא דפוסים',
    description: 'Answer 10 visual questions correctly',
    descriptionHe: 'ענה נכון על 10 שאלות חזותיות',
    icon: 'eye',
    target: 10,
  },
  {
    id: 'logic_master_10',
    name: 'Logic Learner',
    nameHe: 'לומד היגיון',
    description: 'Answer 10 logic questions correctly',
    descriptionHe: 'ענה נכון על 10 שאלות היגיון',
    icon: 'bulb',
    target: 10,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    nameHe: 'שד מהירות',
    description: 'Get 3 stars on 5 questions in a row',
    descriptionHe: 'קבל 3 כוכבים על 5 שאלות ברצף',
    icon: 'zap',
    target: 5,
  },
  {
    id: 'perfect_level',
    name: 'Perfect Score',
    nameHe: 'ציון מושלם',
    description: 'Complete a level with 100% accuracy',
    descriptionHe: 'סיים שלב עם 100% דיוק',
    icon: 'award',
    target: 1,
  },
  {
    id: 'daily_streak_7',
    name: 'Week Warrior',
    nameHe: 'לוחם שבועי',
    description: 'Play 7 days in a row',
    descriptionHe: 'שחק 7 ימים ברצף',
    icon: 'calendar',
    target: 7,
  },
  {
    id: 'star_collector_50',
    name: 'Star Collector',
    nameHe: 'אספן כוכבים',
    description: 'Collect 50 stars',
    descriptionHe: 'אסוף 50 כוכבים',
    icon: 'stars',
    target: 50,
  },
  {
    id: 'gifted_champion',
    name: 'Gifted Champion',
    nameHe: 'אלוף המחוננים',
    description: 'Complete all levels in all categories',
    descriptionHe: 'סיים את כל השלבים בכל הקטגוריות',
    icon: 'trophy',
    target: 40,
  },
];

// Initial User Progress
export const INITIAL_PROGRESS = {
  totalPoints: 0,
  totalStars: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  categoryProgress: {
    math: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1] },
    verbal: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1] },
    visual: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1] },
    logic: { currentLevel: 1, questionsCompleted: 0, correctAnswers: 0, bestScore: 0, starsEarned: 0, unlockedLevels: [1] },
  },
  achievements: [],
  dailyChallengeStreak: 0,
  lastPlayedDate: '',
};

