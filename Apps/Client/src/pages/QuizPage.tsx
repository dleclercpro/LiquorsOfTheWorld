import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../components/forms/QuestionForm';
import { useDispatch, useSelector } from '../hooks/useRedux';
import { REFRESH_STATUS_INTERVAL } from '../config';
import { fetchQuizData } from '../actions/DataActions';
import AdminQuizForm from '../components/forms/AdminQuizForm';
import { useTranslation } from 'react-i18next';
import { AspectRatio, Language, NO_TIME, QuestionType } from '../constants';
import Page from './Page';
import { selectVote } from '../selectors/QuizSelectors';
import useServerCountdownTimer from '../hooks/useServerCountdownTimer';
import useQuiz from '../hooks/useQuiz';
import useUser from '../hooks/useUser';
import useApp from '../hooks/useApp';
import useOverlay from '../hooks/useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';

const QuizPage: React.FC = () => {  
  const { t, i18n } = useTranslation();

  const lang = i18n.language as Language;

  const quiz = useQuiz();
  const user = useUser();
  const app = useApp();
  
  const loadingOverlay = useOverlay(OverlayName.Loading);
  const answerOverlay = useOverlay(OverlayName.Answer);

  const playerQuestionIndex = app.playerQuestionIndex;
  const { vote } = useSelector((state) => selectVote(state, playerQuestionIndex));
  const timer = useServerCountdownTimer();

  const [choice, setChoice] = useState('');

  const dispatch = useDispatch();



  // Fetch initial data
  useEffect(() => {
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    dispatch(fetchQuizData({ quizId: quiz.id, quizName: quiz.name, lang }));
  }, []);



  // Refresh quiz data when changing language
  useEffect(() => {
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    quiz.refreshQuestions();
  }, [lang]);



  // Fetch current quiz status from server when moving to next question
  useEffect(() => {
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    quiz.refreshStatus();

  }, [playerQuestionIndex]);



  // Regularly fetch current quiz status from server
  useEffect(() => {
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    const interval = setInterval(() => quiz.refreshStatus(), REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  // Set choice if user already voted
  useEffect(() => {
    if (vote === null) {
      answerOverlay.close();
      return;
    }

    setChoice(vote);
    answerOverlay.open();
    
  }, [vote]);



  // Show loading screen in case quiz has not yet been started
  useEffect(() => {
    if (!quiz.isStarted && !user.isAdmin) {
      loadingOverlay.open();
    } else {
      loadingOverlay.close();
    }

  }, [quiz.isStarted, user.isAdmin]);



  // Start timer if enabled
  useEffect(() => {
    console.log(timer);
    if (timer.isEnabled && !timer.duration.equals(NO_TIME) && !timer.isRunning) {
      timer.start();
    }
  }, [timer.isEnabled, timer.duration]);



  // Show answer once timer has expired
  useEffect(() => {
    if (timer.isDone) {
      answerOverlay.open();
    }

  }, [timer.isDone]);



  // Wait until data has been fetched
  if (quiz.questions === null || quiz.status === null) {
    return null;
  }

  const { topic, question, type, url, options } = quiz.questions[playerQuestionIndex];

  return (
    <Page title={t('common:COMMON:QUIZ')} className='quiz-page'>
      {!quiz.isStarted && user.isAdmin && (
        <AdminQuizForm />
      )}
      {quiz.isStarted && (
        <QuestionForm
          remainingTime={timer.isRunning ? timer.time : undefined}
          index={playerQuestionIndex}
          topic={topic}
          question={question}
          image={type === QuestionType.Image ? { url: url!, desc: `Question ${playerQuestionIndex + 1}` } : undefined}
          video={type === QuestionType.Video ? { url: url!, desc: `Question ${playerQuestionIndex + 1}` } : undefined}
          ratio={AspectRatio.SixteenByNine}
          options={options}
          disabled={choice === '' || vote !== null}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </Page>
  );
}

export default QuizPage;