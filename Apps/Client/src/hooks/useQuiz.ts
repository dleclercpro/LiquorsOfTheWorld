import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from './ReduxHooks';
import { fetchQuestionsAction, fetchAllDataAction, refreshDataAction } from '../actions/DataActions';
import { startQuizAction as doStartQuiz } from '../actions/QuizActions';
import { deleteQuizAction as doDeleteQuiz } from '../actions/QuizActions';
import { Language, NON_VOTE } from '../constants';
import { useTranslation } from 'react-i18next';
import { setQuestionIndex } from '../reducers/AppReducer';
import { toReversedArray } from '../utils/array';

const useQuiz = () => {
  const { i18n } = useTranslation();
  const language = i18n.language as Language;

  const app = useSelector(({ app }) => app);
  const quiz = useSelector(({ quiz }) => quiz);

  const { id, name } = quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const players = quiz.players.data ?? [];
  const votes = quiz.votes.data ?? [];
  const scores = quiz.scores.data ?? { admins: {}, users: {} };

  const questionIndex = status?.questionIndex;
  
  const isStarted = Boolean(status?.isStarted);
  const isOver = Boolean(status?.isOver);
  const isSupervised = Boolean(status?.isSupervised);
  const isTimed = Boolean(status?.timer.isEnabled);
  const isNextQuestionForced = Boolean(status?.isNextQuestionForced);

  const dispatch = useDispatch();



  // Refresh app quiz ID
  useEffect(() => {
    if (!status || votes.length === 0) return;

    const questionIndex = status.questionIndex ?? 0;

    let lastUnansweredQuestionIndex = toReversedArray(votes)
      .findIndex((vote: number) => vote === NON_VOTE);

    if (lastUnansweredQuestionIndex === -1) {
      lastUnansweredQuestionIndex = 0;
    }
    
    let appQuestionIndex = questionIndex;
    if (!isSupervised && lastUnansweredQuestionIndex < questionIndex) {
      appQuestionIndex = lastUnansweredQuestionIndex;
    }

    if (app.questionIndex !== appQuestionIndex) {
      dispatch(setQuestionIndex(appQuestionIndex));
    }
  }, [status, votes]);



  const fetchAll = useCallback(async () => {
    if (quiz.id === null || !quiz.name || !language) return;

    await dispatch(fetchAllDataAction({ quizId: quiz.id, quizName: quiz.name, language }));

  }, [quiz.id, quiz.name, language]);



  const refreshQuestions = useCallback(async () => {
    if (!quiz.name || !language) return;
    
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