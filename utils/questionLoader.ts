import { Question, QuestionCategory, Difficulty, MathQuestion, VerbalQuestion, VisualQuestion, LogicQuestion } from './types';
import { LEVEL_CONFIGS } from './constants';
import mathQuestions from '@/data/questions/math.json';
import verbalQuestions from '@/data/questions/verbal.json';
import visualQuestions from '@/data/questions/visual.json';
import logicQuestions from '@/data/questions/logic.json';

// Type assertions for imported JSON
const questionBanks: Record<QuestionCategory, Question[]> = {
  math: mathQuestions as MathQuestion[],
  verbal: verbalQuestions as VerbalQuestion[],
  visual: visualQuestions as VisualQuestion[],
  logic: logicQuestions as LogicQuestion[],
};

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get questions for a specific level
export function getQuestionsForLevel(category: QuestionCategory, level: number): Question[] {
  const levelConfig = LEVEL_CONFIGS[level - 1];
  if (!levelConfig) {
    return [];
  }

  const allQuestions = questionBanks[category];
  const { difficulty, questionsCount } = levelConfig;

  // Filter questions by difficulty
  let eligibleQuestions = allQuestions.filter(q => q.difficulty === difficulty);
  
  // If not enough questions of exact difficulty, include adjacent difficulties
  if (eligibleQuestions.length < questionsCount) {
    const adjacentDifficulties: Difficulty[] = 
      difficulty === 'easy' ? ['easy', 'medium'] :
      difficulty === 'medium' ? ['easy', 'medium', 'hard'] :
      ['medium', 'hard'];
    
    eligibleQuestions = allQuestions.filter(q => adjacentDifficulties.includes(q.difficulty));
  }

  // Shuffle and take required number
  const shuffled = shuffleArray(eligibleQuestions);
  return shuffled.slice(0, questionsCount);
}

// Get questions for daily challenge (mixed categories)
export function getDailyChallengeQuestions(): Question[] {
  const questions: Question[] = [];
  
  // 3 math, 3 verbal, 2 visual, 2 logic
  const distribution: [QuestionCategory, number][] = [
    ['math', 3],
    ['verbal', 3],
    ['visual', 2],
    ['logic', 2],
  ];

  distribution.forEach(([category, count]) => {
    const categoryQuestions = shuffleArray(questionBanks[category]);
    // Mix difficulties for daily challenge
    questions.push(...categoryQuestions.slice(0, count));
  });

  // Shuffle the final mix
  return shuffleArray(questions);
}

// Get random practice questions
export function getRandomQuestions(category: QuestionCategory, count: number = 5): Question[] {
  const allQuestions = questionBanks[category];
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, count);
}

