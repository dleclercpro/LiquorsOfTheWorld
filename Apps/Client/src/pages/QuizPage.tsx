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



  // Fetch initial data only once!
  useEffect(() => {
    if (!user.isAuthenticated || quiz.id === null) {
      return;
    }

    quiz.fetchData();

  }, [user.isAuthenticated, quiz.id]);



  // Refresh questions' JSON when changing language
  useEffect(() => {
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    quiz.refreshQuestions();
  }, [lang]);



  // Fetch current quiz status from server when moving to next question
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    // Do not run for first question
    if (app.questionIndex === 0) {
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
    if (!user.isAuthenticated) {
      return;
    }
    if (quiz.id === null || quiz.name === null) {
      return;
    }

    const interval = setInterval(quiz.refreshStatusPlayersAndScores, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  // Set choice if user already voted
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (vote.value === null || vote.index === -1) {
      if (answerOverlay.isOpen) {
        answerOverlay.close();
      }
      return;
    }

    setChoice(vote.value);
    if (!answerOverlay.isOpen) {
      answerOverlay.open();
    }
    
  }, [vote.value]);



  // Show loading screen in case quiz has not yet been started
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (!quiz.isStarted && !user.isAdmin) {
      loadingOverlay.open();
    } else {
      loadingOverlay.close();
    }

  }, [quiz.isStarted, user.isAdmin]);



  // Start timer if enabled
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (timer.isEnabled && !timer.isRunning && quiz.isStarted) {
      timer.start();
    }
  }, [timer.isEnabled, timer.isRunning, quiz.isStarted]);



  // Show answer once timer has expired
  useEffect(() => {
    if (!user.isAuthenticated) {
      return;
    }
    if (quiz.isStarted && timer.isEnabled && timer.isDone) {
      answerOverlay.open();
    }

  }, [quiz.isStarted, timer.isEnabled, timer.isDone]);


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
          remainingTime={timer.isEnabled && (timer.isRunning || timer.isDone) ? timer.time : undefined}
          index={app.questionIndex}
          topic={topic}
          question={question}
          image={type === QuestionType.Image ? { url: url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          video={type === QuestionType.Video ? { url: url!, desc: `Question ${app.questionIndex + 1}` } : undefined}
          ratio={AspectRatio.FourByThree}
          options={options}
          disabled={choice === ''}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </Page>
  );
}

export default QuizPage;