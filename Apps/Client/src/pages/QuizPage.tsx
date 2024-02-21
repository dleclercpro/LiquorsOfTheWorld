import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/forms/QuestionForm';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_STATUS_INTERVAL } from '../config';
import { fetchStatus, fetchInitialData } from '../actions/QuizActions';
import { selectVote } from '../reducers/QuizReducer';
import { showAnswer } from '../reducers/OverlaysReducer';

const QuizPage: React.FC = () => {
  const quiz = useSelector(({ quiz }) => quiz);
  const questionIndex = useSelector((state) => state.app.questionIndex);
  const { vote } = useSelector((state) => selectVote(state, questionIndex));

  const [choice, setChoice] = useState('');

  const dispatch = useDispatch();

  const quizId = quiz.id;
  const questions = quiz.questions.data;

  // Fetch data
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchInitialData(quizId));
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
  }, [quizId]);

  // Set choice if user already voted
  useEffect(() => {
    if (vote === null) {
      return;
    }

    setChoice(vote);
    dispatch(showAnswer());
    
  }, [vote]);



  // Wait until data has been fetched
  if (questions === null) {
    return null;
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