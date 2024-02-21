import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/forms/QuestionForm';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_INTERVAL_QUESTION_INDEX } from '../config';
import { fetchQuestionIndexData, fetchInitialData } from '../actions/QuizActions';
import { selectVote } from '../reducers/QuizReducer';

const QuizPage: React.FC = () => {
  const quizId = useSelector((state) => state.quiz.id);
  const questionIndex = useSelector((state) => state.app.questionIndex);

  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const questions = quiz.questions.data;

  const [choice, setChoice] = useState('');

  const { vote } = useSelector((state) => selectVote(state, questionIndex));

  // Fetch data
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchInitialData(quizId));
  }, []);

  // Regularly fetch current question index (will change as players vote)
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    const interval = setInterval(async () => {
      console.log(`Fetching current question index on server...`);
      await dispatch(fetchQuestionIndexData(quizId));

    }, REFRESH_INTERVAL_QUESTION_INDEX);
  
    return () => clearInterval(interval);
  }, [quizId]);

  // Set choice if user already voted
  useEffect(() => {
    if (vote === null) {
      return;
    }

    setChoice(vote);
  }, [vote]);



  // Wait until quiz data has been fetched
  if (questions === null) {
    return null;
  }

  const nextQuestionIndex = questionIndex + 1;
  if (nextQuestionIndex === questions.length) {
    return <Navigate to='/scores' />;
  }

  const { theme, question, options } = questions[questionIndex];

  return (
    <React.Fragment>
      <HamburgerMenu />
      <QuestionBox
        index={questionIndex}
        theme={theme}
        question={question}
        options={options}
        disabled={choice === '' || vote !== null}
        choice={choice}
        setChoice={setChoice}
      /> 
    </React.Fragment>
  );
}

export default QuizPage;