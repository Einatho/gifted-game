import { Question, QuestionCategory, MathQuestion, VerbalQuestion, VisualQuestion, LogicQuestion } from './types';
import { LEVEL_CONFIGS } from './constants';
import mathQuestions from '@/data/questions/math.json';
import verbalQuestions from '@/data/questions/verbal.json';
import visualQuestions from '@/data/questions/visual.json';
import logicQuestions from '@/data/questions/logic.json';

const questionBanks: Record<QuestionCategory, Question[]> = {
  math: mathQuestions as MathQuestion[],
  verbal: verbalQuestions as VerbalQuestion[],
  visual: visualQuestions as VisualQuestion[],
  logic: logicQuestions as LogicQuestion[],
};

const usedQuestionIds: Record<QuestionCategory, Set<string>> = {
  math: new Set(),
  verbal: new Set(),
  visual: new Set(),
  logic: new Set(),
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleQuestionOptions<T extends Question>(question: T): T {
  const shuffledQuestion = { ...question };
  
  if (question.category === 'math' || question.category === 'logic') {
    const q = shuffledQuestion as MathQuestion | LogicQuestion;
    const correctOption = q.options[q.correctAnswer];
    const indices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const newOptions = shuffledIndices.map(i => q.options[i]);
    const newCorrectAnswer = newOptions.indexOf(correctOption);
    (shuffledQuestion as MathQuestion | LogicQuestion).options = newOptions;
    shuffledQuestion.correctAnswer = newCorrectAnswer;
  } else if (question.category === 'verbal') {
    const q = shuffledQuestion as VerbalQuestion;
    const correctOption = q.options[q.correctAnswer];
    const indices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const newOptions = shuffledIndices.map(i => q.options[i]);
    const newCorrectAnswer = newOptions.findIndex(
      opt => opt[0] === correctOption[0] && opt[1] === correctOption[1]
    );
    (shuffledQuestion as VerbalQuestion).options = newOptions as [string, string][];
    shuffledQuestion.correctAnswer = newCorrectAnswer;
  } else if (question.category === 'visual') {
    const q = shuffledQuestion as VisualQuestion;
    const correctOption = JSON.stringify(q.options[q.correctAnswer]);
    const indices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const newOptions = shuffledIndices.map(i => q.options[i]);
    const newCorrectAnswer = newOptions.findIndex(
      opt => JSON.stringify(opt) === correctOption
    );
    (shuffledQuestion as VisualQuestion).options = newOptions;
    shuffledQuestion.correctAnswer = newCorrectAnswer;
  }
  
  return shuffledQuestion;
}

export function resetUsedQuestions(category?: QuestionCategory) {
  if (category) {
    usedQuestionIds[category].clear();
  } else {
    usedQuestionIds.math.clear();
    usedQuestionIds.verbal.clear();
    usedQuestionIds.visual.clear();
    usedQuestionIds.logic.clear();
  }
}

export function getQuestionsForLevel(category: QuestionCategory, level: number): Question[] {
  const levelConfig = LEVEL_CONFIGS[level - 1];
  if (!levelConfig) {
    return [];
  }

  const allQuestions = questionBanks[category];
  const { questionsCount } = levelConfig;

  // Use all questions regardless of difficulty - the pool is small enough
  // that restricting by difficulty causes heavy repetition across levels
  let eligible = allQuestions.filter(q => !usedQuestionIds[category].has(q.id));

  // If we've used most questions, reset the tracker so we can recycle
  if (eligible.length < questionsCount) {
    usedQuestionIds[category].clear();
    eligible = [...allQuestions];
  }

  const shuffled = shuffleArray(eligible);
  const selected = shuffled.slice(0, questionsCount);

  selected.forEach(q => usedQuestionIds[category].add(q.id));

  return selected.map(q => shuffleQuestionOptions(q));
}

export function getDailyChallengeQuestions(): Question[] {
  const questions: Question[] = [];
  
  const distribution: [QuestionCategory, number][] = [
    ['math', 3],
    ['verbal', 3],
    ['visual', 2],
    ['logic', 2],
  ];

  distribution.forEach(([category, count]) => {
    const categoryQuestions = shuffleArray(questionBanks[category]);
    questions.push(...categoryQuestions.slice(0, count).map(q => shuffleQuestionOptions(q)));
  });

  return shuffleArray(questions);
}

export function getRandomQuestions(category: QuestionCategory, count: number = 5): Question[] {
  const allQuestions = questionBanks[category];
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, count).map(q => shuffleQuestionOptions(q));
}

export function getRealTestQuestions(): Question[] {
  const questions: Question[] = [];
  
  const distribution: [QuestionCategory, number, number, number][] = [
    ['math', 2, 2, 1],
    ['verbal', 2, 2, 1],
    ['visual', 1, 2, 2],
    ['logic', 1, 2, 2],
  ];

  distribution.forEach(([category, easyCount, mediumCount, hardCount]) => {
    const categoryQuestions = questionBanks[category];
    
    const easyQuestions = shuffleArray(categoryQuestions.filter(q => q.difficulty === 'easy')).slice(0, easyCount);
    const mediumQuestions = shuffleArray(categoryQuestions.filter(q => q.difficulty === 'medium')).slice(0, mediumCount);
    const hardQuestions = shuffleArray(categoryQuestions.filter(q => q.difficulty === 'hard')).slice(0, hardCount);
    
    questions.push(
      ...easyQuestions.map(q => shuffleQuestionOptions(q)),
      ...mediumQuestions.map(q => shuffleQuestionOptions(q)),
      ...hardQuestions.map(q => shuffleQuestionOptions(q))
    );
  });

  return shuffleArray(questions);
}
