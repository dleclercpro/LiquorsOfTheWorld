import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from './ReduxHooks';
import { fetchQuestionsAction, fetchAllDataAction, refreshDataAction } from '../actions/DataActions';
import { startQuizAction as doStartQuiz } from '../actions/QuizActions';
import { deleteQuizAction as doDeleteQuiz } from '../actions/QuizActions';
import { Language, NO_QUESTION_INDEX, NO_VOTE_INDEX } from '../constants';
import { useTranslation } from 'react-i18next';
import useApp from './useApp';
import { setQuestionIndex } from '../reducers/AppReducer';
import { DEBUG } from '../config';

const useQuiz = () => {
  const { i18n } = useTranslation();
  const language = i18n.language as Language;

  const app = useApp();

  const quiz = useSelector(({ quiz }) => quiz);

  const { id, name } = quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const teams = quiz.teams.data ?? [];
  const players = quiz.players.data ?? [];
  const votes = quiz.votes.data ?? [];
  const scores = quiz.scores.data ?? { admins: {}, users: {} };

  const questionIndex = status?.questionIndex ?? 0;
  
  const isStarted = Boolean(status?.isStarted);
  const isOver = Boolean(status?.isOver);
  const isSupervised = Boolean(status?.isSupervised);
  const isTimed = Boolean(status?.timer);
  const isNextQuestionForced = Boolean(status?.isNextQuestionForced);

  const dispatch = useDispatch();



  const initializeQuestionIndex = useCallback(() => {
    if (votes.length === 0) return;
    const lastQuestionIndex = votes.length - 1;

    // Identify next question to be answered by user
    let lastUnansweredQuestionIndex = votes.findIndex((vote: number) => vote === NO_VOTE_INDEX);
    
    if (lastUnansweredQuestionIndex === -1) {
      lastUnansweredQuestionIndex = lastQuestionIndex;
    }

    if (app.questionIndex !== lastUnansweredQuestionIndex) {
      dispatch(setQuestionIndex(lastUnansweredQuestionIndex));
    }
  }, [votes]);



  const updateQuestionIndex = useCallback(() => {
    if (!status) return;

    // Force user to go to next question according to setting
    if (status.isNextQuestionForced && app.questionIndex !== questionIndex) {
      if (DEBUG) {
        console.log(`Forcing user to next question: #${questionIndex + 1}`);
      }
      dispatch(setQuestionIndex(questionIndex));
    }
  }, [status]);



  const fetchAll = useCallback(async () => {
    if (quiz.id === null || quiz.name === null || !language) return;

    await dispatch(fetchAllDataAction({ quizId: quiz.id, quizName: quiz.name, language }));

  }, [quiz.id, quiz.name, language]);



  const refreshQuestions = useCallback(async () => {
    if (quiz.name === null || !language) return;
    
    await dispatch(fetchQuestionsAction({ quizName: quiz.name, language }));
  }, [quiz.name, language]);



  const refreshStatusPlayersAndScores = useCallback(async () => {
    if (!quiz.id) return;

    await dispatch(refreshDataAction({ quizId: quiz.id }));

  }, [quiz.id]);



  const startQuiz = useCallback(async (isSupervised: boolean, isTimed: boolean, isNextQuestionForced: boolean) => {
    if (quiz.id === null) return;

    return await dispatch(doStartQuiz({ quizId: quiz.id, language, isSupervised, isTimed, isNextQuestionForced }));
  }, [quiz.id]);



  const deleteQuiz = useCallback(async () => {
    if (quiz.id === null) return;

    return await dispatch(doDeleteQuiz(quiz.id));
  }, [quiz.id]);



  // Handle question index
  useEffect(() => {
    // When loading app for the first time, reset question index
    if (app.questionIndex === NO_QUESTION_INDEX) {
      initializeQuestionIndex();
    }
    // On further changes
    else {
      updateQuestionIndex();
    }
  }, [initializeQuestionIndex, updateQuestionIndex]);



  return {
    id,
    name,
    questionIndex,
    isStarted,
    isOver,
    isSupervised,
    isTimed,
    isNextQuestionForced,
    questions,
    status,
    teams,
    players,
    votes,
    scores,
    fetchData: fetchAll,
    refreshQuestions,
    refreshStatusPlayersAndScores,
    start: startQuiz,
    delete: deleteQuiz,
  };
};

export default useQuiz;