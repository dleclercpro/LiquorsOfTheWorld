import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../components/forms/QuestionForm';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_STATUS_INTERVAL } from '../config';
import { fetchStatus, fetchQuizData, fetchQuestions } from '../actions/DataActions';
import { closeAnswerOverlay, closeLoadingOverlay, openAnswerOverlay, openLoadingOverlay } from '../reducers/OverlaysReducer';
import AdminQuizForm from '../components/forms/AdminQuizForm';
import { useTranslation } from 'react-i18next';
import { AspectRatio, Language, NO_TIME, QuestionType } from '../constants';
import { logout } from '../actions/AuthActions';
import Page from './Page';
import { selectVote } from '../selectors/QuizSelectors';
import useCountdownTimer from '../hooks/timer';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

const QuizPage: React.FC = () => {  
  const { t, i18n } = useTranslation();

  const lang = i18n.language as Language;

  const quiz = useSelector(({ quiz }) => quiz);
  const isAdmin = useSelector(({ user }) => user.isAdmin);

  const playerQuestionIndex = useSelector((state) => state.app.questionIndex);
  const { vote } = useSelector((state) => selectVote(state, playerQuestionIndex));

  const [choice, setChoice] = useState('');

  const dispatch = useDispatch();

  const quizId = quiz.id;
  const quizName = quiz.name;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const isStarted = status?.isStarted;



  // Handle question timer
  const serverTimer = status?.timer;

  const duration = serverTimer?.duration ? new TimeDuration(serverTimer.duration.amount, serverTimer.duration.unit) : NO_TIME;
  const startedAt = serverTimer?.startedAt ? new Date(serverTimer.startedAt) : new Date();

  const alreadySpentTime = new TimeDuration(new Date().getTime() - startedAt.getTime(), TimeUnit.Millisecond);
  const remainingTime = duration.subtract(alreadySpentTime);

  const timer = useCountdownTimer({
    interval: new TimeDuration(1, TimeUnit.Second),
    duration: remainingTime,
    autoStart: false,
  });



  // Fetch initial data
  useEffect(() => {
    if (quizId === null || quizName === null) {
      return;
    }

    dispatch(fetchQuizData({ quizId, quizName, lang }));
  }, []);



  // Refresh quiz data when changing language
  useEffect(() => {
    if (quizId === null || quizName === null) {
      return;
    }

    dispatch(fetchQuestions({ lang, quizName }));
  }, [lang]);



  // Regularly fetch current quiz status from server
  useEffect(() => {
    if (quizId === null || quizName === null) {
      return;
    }

    const interval = setInterval(async () => {
      const result = await dispatch(fetchStatus(quizId));

      if (result.type.endsWith('/rejected')) {
        dispatch(logout());
      }

    }, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  // Set choice if user already voted
  useEffect(() => {
    if (vote === null) {
      dispatch(closeAnswerOverlay());
      return;
    }

    setChoice(vote);
    dispatch(openAnswerOverlay());
    
  }, [vote]);



  // Show loading screen in case quiz has not yet been started
  useEffect(() => {
    if (!isStarted && !isAdmin) {
      dispatch(openLoadingOverlay());
    } else {
      dispatch(closeLoadingOverlay());
    }

  }, [isStarted, isAdmin]);



  // Start timer if enabled
  useEffect(() => {
    if (serverTimer && serverTimer.isEnabled && !timer.isRunning) {
      timer.start();
    }
  }, [serverTimer?.isEnabled]);



  // Wait until data has been fetched
  if (questions === null || status === null) {
    return null;
  }

  const { topic, question, type, url, options } = questions[playerQuestionIndex];

  return (
    <Page title={t('common:COMMON:QUIZ')} className='quiz-page'>
      {!isStarted && isAdmin && (
        <AdminQuizForm />
      )}
      {isStarted && (
        <QuestionForm
          index={playerQuestionIndex}
          topic={topic}
          question={question}
          image={type === QuestionType.Image ? { url: url!, desc: `Question ${playerQuestionIndex + 1}` } : undefined}
          video={type === QuestionType.Video ? { url: url!, desc: `Question ${playerQuestionIndex + 1}` } : undefined}
          ratio={AspectRatio.SixteenByNine}
          options={options}
          remainingTime={timer.time}
          disabled={choice === '' || vote !== null}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </Page>
  );
}

export default QuizPage;