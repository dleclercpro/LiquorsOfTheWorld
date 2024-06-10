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
import useQuestion from '../hooks/useQuestion';

const QuizPage: React.FC = () => {  
  const { t, i18n } = useTranslation();

  const language = i18n.language as Language;

  const app = useApp();
  const quiz = useQuiz();
  const user = useUser();
  const question = useQuestion(app.questionIndex);

  const loadingOverlay = useOverlay(OverlayName.Loading);
  const answerOverlay = useOverlay(OverlayName.Answer);
  const lobbyOverlay = useOverlay(OverlayName.Lobby);

  const timer = useServerCountdownTimer();

  const [choice, setChoice] = useState('');

  const isReady = quiz.id !== null && quiz.questions !== null && quiz.status !== null && question !== null && question.data !== null;



  // Handle loading overlay based on presence of data
  useEffect(() => {
    if (!isReady && !loadingOverlay.isOpen) {
      loadingOverlay.open();
    }
    if (isReady && loadingOverlay.isOpen) {
      loadingOverlay.close();
    }

  }, [isReady, loadingOverlay.isOpen]);



  // Fetch initial data only once!
  useEffect(() => {
    if (isReady) {
      return;
    }

    quiz.fetchAllData();

  }, [isReady]);



  // Refresh questions' JSON when changing language
  useEffect(() => {
    quiz.refreshQuestions();
  }, [language]);



  // Fetch current quiz status from server when moving to
  // next question
  useEffect(() => {

    // Do not run for first question
    if (app.questionIndex < 1) {
      return;
    }

    quiz.refreshStatusPlayersAndScores()
      .then(() => {
        if (timer.isEnabled) {
          timer.restart();
        }
      });

  }, [app.questionIndex]);



  // Regularly fetch current quiz status from server
  useEffect(() => {
    const interval = setInterval(quiz.refreshStatusPlayersAndScores, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  // Set choice if user already voted
  useEffect(() => {
    if (question.answer.chosen === null) {
      if (answerOverlay.isOpen) {
        answerOverlay.close();
      }
      return;
    }

    if (choice !== question.answer.chosen.value) {
      setChoice(question.answer.chosen.value);
    }

    if (!answerOverlay.isOpen) {
      answerOverlay.open();
    }
    
  }, [question.answer.chosen]);



  // Open answer layer if quiz is over
  useEffect(() => {
    if (quiz.isOver && !answerOverlay.isOpen) {
      answerOverlay.open();
    }
    
  }, [quiz.isOver, answerOverlay.isOpen]);



  // Start timer if enabled
  const shouldStartTimer = timer.isEnabled && !timer.isRunning && quiz.isStarted;
  useEffect(() => {
    if (shouldStartTimer) {
      timer.start();
    }
  }, [shouldStartTimer]);



  // Show answer once timer has expired
  const shouldShowAnswer = timer.isEnabled && quiz.isStarted && timer.isDone;
  useEffect(() => {
    if (shouldShowAnswer) {
      answerOverlay.open();
    }

  }, [shouldShowAnswer]);



  // Show lobby to non-admin users
  useEffect(() => {
    if (user.isAdmin) return;

    if (!quiz.isStarted && !lobbyOverlay.isOpen) {
      lobbyOverlay.open();
    }

    if (quiz.isStarted && lobbyOverlay.isOpen) {
      lobbyOverlay.close();
    }

  }, [quiz.isStarted, user.isAdmin]);



  // Wait until data has been fetched
  if (!isReady) {
    return null;
  }


  
  return (
    <Page title={t('common:COMMON:QUIZ')} className='quiz-page'>
      {!quiz.isStarted && user.isAdmin && (
        <AdminQuizForm />
      )}
      {quiz.isStarted && (
        <QuestionForm
          remainingTime={timer.isEnabled && (timer.isRunning || timer.isDone) ? timer.time : undefined}
          index={question.index}
          topic={question.data!.topic}
          question={question.data!.question}
          image={question.data!.type === QuestionType.Image ? { url: question.data!.url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          video={question.data!.type === QuestionType.Video ? { url: question.data!.url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          ratio={AspectRatio.FourByThree}
          options={question.data!.options}
          disabled={choice === ''}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </Page>
  );
}

export default QuizPage;