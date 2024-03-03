import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../components/forms/QuestionForm';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_STATUS_INTERVAL } from '../config';
import { fetchStatus, fetchData, fetchQuestions } from '../actions/QuizActions';
import { selectVote } from '../reducers/QuizReducer';
import { closeAnswerOverlay, closeLoadingOverlay, openAnswerOverlay, openLoadingOverlay } from '../reducers/OverlaysReducer';
import StartQuizForm from '../components/forms/StartQuizForm';
import { useTranslation } from 'react-i18next';
import { AspectRatio, Language, QuestionType } from '../constants';
import { logout } from '../actions/UserActions';

const QuizPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as Language;

  const quiz = useSelector(({ quiz }) => quiz);
  const isAdmin = useSelector(({ user }) => user.isAdmin);

  const playerQuestionIndex = useSelector((state) => state.app.questionIndex);
  const { vote } = useSelector((state) => selectVote(state, playerQuestionIndex));

  const [choice, setChoice] = useState('');

  const dispatch = useDispatch();

  const quizId = quiz.id;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const isStarted = status?.isStarted;



  // Fetch initial data
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchData({ quizId, lang }));
  }, []);

  // Refresh quiz data when changing language
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchQuestions(lang));
  }, [lang]);

  // Regularly fetch current quiz status from server
  useEffect(() => {
    if (quizId === null) {
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



  // Wait until data has been fetched
  if (questions === null || status === null) {
    return null;
  }

  const { theme, question, type, url, options } = questions[playerQuestionIndex];

  return (
    <div className='quiz-page'>
      {!isStarted && isAdmin && (
        <StartQuizForm />
      )}
      {isStarted && (
        <QuestionForm
          index={playerQuestionIndex}
          theme={theme}
          question={question}
          image={type === QuestionType.Image ? { url: url!, desc: `Question ${playerQuestionIndex + 1}` } : undefined}
          video={type === QuestionType.Video ? { url: url!, desc: `Question ${playerQuestionIndex + 1}` } : undefined}
          ratio={AspectRatio.Rectangle}
          options={options}
          disabled={choice === '' || vote !== null}
          choice={choice}
          setChoice={setChoice}
        />
      )}
    </div>
  );
}

export default QuizPage;