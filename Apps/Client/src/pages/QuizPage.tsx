import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionForm from '../components/forms/QuestionForm';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_STATUS_INTERVAL } from '../config';
import { fetchStatus, fetchData } from '../actions/QuizActions';
import { selectVote } from '../reducers/QuizReducer';
import { hideAnswer, hideLoading, showAnswer, showLoading } from '../reducers/OverlaysReducer';
import StartQuizForm from '../components/forms/StartQuizForm';

const QuizPage: React.FC = () => {
  const quiz = useSelector(({ quiz }) => quiz);
  const isAdmin = useSelector(({ user }) => user.isAdmin);

  const questionIndex = useSelector((state) => state.app.questionIndex);
  const { vote } = useSelector((state) => selectVote(state, questionIndex));

  const [choice, setChoice] = useState('');

  const dispatch = useDispatch();

  const quizId = quiz.id;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const hasStarted = status?.hasStarted;

  // Fetch data
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchData(quizId));
  }, []);

  // Regularly fetch current quiz status from server
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    const interval = setInterval(async () => {
      await dispatch(fetchStatus(quizId));

    }, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);

  // Set choice if user already voted
  useEffect(() => {
    if (vote === null) {
      dispatch(hideAnswer());
      return;
    }

    setChoice(vote);
    dispatch(showAnswer());
    
  }, [vote]);

  // Show loading screen in case quiz has not yet been started
  useEffect(() => {
    if (!hasStarted && !isAdmin) {
      dispatch(showLoading({ text: 'Please wait for quiz to start...', opaque: true }));
    } else {
      dispatch(hideLoading());
    }

  }, [hasStarted]);



  // Wait until data has been fetched
  if (questions === null || status === null) {
    return null;
  }

  const { theme, question, options } = questions[questionIndex];

  return (
    <>
      <HamburgerMenu />
      {!hasStarted && isAdmin && (
        <StartQuizForm />
      )}
      {hasStarted && (
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
    </>
  );
}

export default QuizPage;