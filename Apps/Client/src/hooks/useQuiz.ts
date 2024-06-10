import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from './ReduxHooks';
import { fetchQuestionDataAction, fetchAllDataAction, refreshDataAction } from '../actions/DataActions';
import { startQuizAction as doStartQuiz } from '../actions/QuizActions';
import { deleteQuizAction as doDeleteQuiz } from '../actions/QuizActions';
import { Language, NO_QUESTION_INDEX, NO_VOTE_INDEX, UserType } from '../constants';
import { useTranslation } from 'react-i18next';
import useApp from './useApp';
import { setQuestionIndex } from '../reducers/AppReducer';
import { sleep } from '../utils/time';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import useUser from './useUser';
import { GroupedScoresData, GroupedVotesData, PlayersData, StatusData } from '../types/DataTypes';
import { QuizJSON } from '../types/JSONTypes';

const useQuiz = () => {
  // Note: no new instances will be created, since the props are directly derived
  // from the root state
  const quiz = useSelector(({ quiz }) => quiz);
  const app = useApp();
  const user = useUser();

  const { i18n } = useTranslation();
  const language = i18n.language as Language;

  const { id, name, label } = quiz;

  const questions: QuizJSON | null = quiz.questions.data ?? null;
  const status: StatusData | null = quiz.status.data ?? null;
  const teams: string[] = quiz.teams.data ?? [];
  const players: PlayersData = quiz.players.data ?? [];
  const votes: GroupedVotesData = quiz.votes.data ?? { [UserType.Admin]: {}, [UserType.Regular]: {} };
  const scores: GroupedScoresData = quiz.scores.data ?? { [UserType.Admin]: {}, [UserType.Regular]: {} };

  const questionIndex = status?.questionIndex ?? 0;
  
  const isStarted = Boolean(status?.isStarted);
  const isOver = Boolean(status?.isOver);
  const isSupervised = Boolean(status?.isSupervised);
  const isTimed = Boolean(status?.timer);
  const isNextQuestionForced = Boolean(status?.isNextQuestionForced);

  const dispatch = useDispatch();



  const initializeQuestionIndex = useCallback(() => {
    if (user.username === null) return;

    const currentVotes = votes[user.isAdmin ? UserType.Admin : UserType.Regular][user.username];

    if (!currentVotes || currentVotes.length === 0) return;
    const lastQuestionIndex = currentVotes.length - 1;

    // Identify next question to be answered by user
    let lastUnansweredQuestionIndex = currentVotes.findIndex((vote: number) => vote === NO_VOTE_INDEX);
    
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
      dispatch(setQuestionIndex(questionIndex));
    }
  }, [status]);



  const fetchAllData = useCallback(async () => {
    if (quiz.id === null || quiz.name === null || !language) return;

    // Fake processing time
    await sleep(new TimeDuration(1, TimeUnit.Second));

    await dispatch(fetchAllDataAction({ quizId: quiz.id, quizName: quiz.name, language }));

  }, [quiz.id, quiz.name, language]);



  const refreshQuestionData = useCallback(async () => {
    if (quiz.name === null || !language) return;
    
    await dispatch(fetchQuestionDataAction({ quizName: quiz.name, language }));
  }, [quiz.name, language]);



  const refreshStatusPlayersAndScores = useCallback(async () => {
    if (quiz.id === null) return;

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
    label,
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
    fetchAllData,
    refreshQuestionData,
    refreshStatusPlayersAndScores,
    start: startQuiz,
    delete: deleteQuiz,
  };
};

export default useQuiz;