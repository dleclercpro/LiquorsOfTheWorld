import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../components/forms/QuestionForm';
import { REFRESH_STATUS_INTERVAL } from '../config';
import AdminQuizForm from '../components/forms/AdminQuizForm';
import { useTranslation } from 'react-i18next';
import { AspectRatio, Language, QuestionType } from '../constants';
import Page from './Page';
import useServerCountdownTimer from '../hooks/useServerCountdownTimer';
import useQuiz from '../hooks/useQuiz';
import useUser from '../hooks/useUser';
import useApp from '../hooks/useApp';
import useOverlay from '../hooks/useOverlay';
import { OverlayName } from '../reducers/OverlaysReducer';
import useVote from '../hooks/useVote';

const QuizPage: React.FC = () => {  
  const { t, i18n } = useTranslation();

  const lang = i18n.language as Language;

  const app = useApp();
  const quiz = useQuiz();
  const user = useUser();
  const vote = useVote(app.questionIndex);
  
  const loadingOverlay = useOverlay(OverlayName.Loading);
  const answerOverlay = useOverlay(OverlayName.Answer);

  const timer = useServerCountdownTimer();

  const [choice, setChoice] = useState('');



  // Fetch initial data
  useEffect(() => {
    quiz.fetchData();
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

    // Do not run for first question
    if (app.questionIndex === 0) {
      return;
    }

    quiz.refreshStatus()
      .then(() => {
        timer.restart();
      });

  }, [app.questionIndex]);



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
    if (vote.vote === null) {
      if (answerOverlay.isOpen) {
        answerOverlay.close();
      }
      return;
    }

    setChoice(vote.vote);
    if (!answerOverlay.isOpen) {
      answerOverlay.open();
    }
    
  }, [vote.vote]);



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
    if (timer.isEnabled && !timer.isRunning && quiz.isStarted) {
      timer.start();
    }
  }, [timer.isEnabled, timer.isRunning, quiz.isStarted]);



  // Show answer once timer has expired
  useEffect(() => {
    if (timer.isDone) {
      answerOverlay.open();
    }

  }, [timer.isDone]);



  // Wait until data has been fetched
  if (!quiz.questions || !quiz.status) {
    return null;
  }


  
  const { topic, question, type, url, options } = quiz.questions[app.questionIndex];

  return (
    <Page title={t('common:COMMON:QUIZ')} className='quiz-page'>
      {!quiz.isStarted && user.isAdmin && (
        <AdminQuizForm />
      )}
      {quiz.isStarted && (
        <QuestionForm
          remainingTime={(timer.isRunning || timer.isDone) ? timer.time : undefined}
          index={app.questionIndex}
          topic={topic}
          question={question}
          image={type === QuestionType.Image ? { url: url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          video={type === QuestionType.Video ? { url: url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          ratio={AspectRatio.SixteenByNine}
          options={options}
          disabled={choice === '' || vote.vote !== null}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </Page>
  );
}

export default QuizPage;