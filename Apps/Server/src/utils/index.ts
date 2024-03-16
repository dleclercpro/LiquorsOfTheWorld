import { Language, QuizName } from '../constants';
import { QuizJSON } from '../types/JSONTypes';

export const getQuestions = async (quizName: QuizName, lang: Language = Language.EN) => {
  const questions = await import(`../../data/${lang}/${quizName}.json`);

  return questions.default as QuizJSON;
}