import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import QuestionForm from '../components/forms/QuestionForm';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_STATUS_INTERVAL } from '../config';
import { fetchStatus, fetchData } from '../actions/QuizActions';
import { selectVote } from '../reducers/QuizReducer';
import { hideAnswerOverlay, hideLoadingOverlay, showAnswerOverlay, showLoadingOverlay } from '../reducers/OverlaysReducer';
import StartQuizForm from '../components/forms/StartQuizForm';
import { useTranslation } from 'react-i18next';
import Nav from '../components/Nav';
import { Language } from '../constants';
import { logout } from '../actions/UserActions';

const QuizPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as Language;

  const quiz = useSelector(({ quiz }) => quiz);
  const isAdmin = useSelector(({ user }) => user.isAdmin);

  const questionIndex = useSelector((state) => state.app.questionIndex);
  const { vote } = useSelector((state) => selectVote(state, questionIndex));

  const [choice, setChoice] = useState('');

  const dispatch = useDispatch();

  const quizId = quiz.id;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const isStarted = status?.isStarted;

  // Fetch data
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchData({ quizId, lang }));
  }, []);

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
      dispatch(hideAnswerOverlay());
      return;
    }

    setChoice(vote);
    dispatch(showAnswerOverlay());
    
  }, [vote]);

  // Show loading screen in case quiz has not yet been started
  useEffect(() => {
    if (!isStarted && !isAdmin) {
      dispatch(showLoadingOverlay());
    } else {
      dispatch(hideLoadingOverlay());
    }

  }, [isStarted, isAdmin]);



  // Wait until data has been fetched
  if (questions === null || status === null) {
    return null;
  }

  const { theme, question, options } = questions[questionIndex];

  return (
    <div className='quiz-page'>
      <Nav />

      {!isStarted && isAdmin && (
        <StartQuizForm />
      )}
      {isStarted && (
        <QuestionForm
          index={questionIndex}
          theme={theme}
          question={question}
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