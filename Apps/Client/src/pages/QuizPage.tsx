import React, { useEffect, useState } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/forms/QuestionForm';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../hooks/redux';
import { REFRESH_INTERVAL_QUESTION_INDEX } from '../config';
import { hideLoading, showLoading } from '../reducers/OverlaysReducer';
import { fetchQuizData, fetchVotes, fetchScores, fetchQuestionIndexData } from '../actions/QuizActions';

const QuizPage: React.FC = () => {
  const quizId = useSelector((state) => state.quiz.id);

  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const questionIndex = quiz.questionIndex.data;
  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  const [choice, setChoice] = useState('');

  let playerMustWait = false;
  if (questionIndex !== null && votes !== null) {
    playerMustWait = votes.length === questionIndex + 1;
  }

  // Show waiting screen when others need to vote
  useEffect(() => {
    if (playerMustWait) {
      dispatch(showLoading({ text: `Wait for others to vote...`, opaque: false }));
    } else {
      dispatch(hideLoading());
    }

  }, [playerMustWait]);

  // Fetch data
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchQuizData());
    dispatch(fetchVotes(quizId));
    dispatch(fetchScores(quizId));
    dispatch(fetchQuestionIndexData(quizId));

  }, []);

  // Regularly fetch current question index (will change as players vote)
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    const interval = setInterval(async () => {
      console.log(`Fetching current question index...`);
      await dispatch(fetchQuestionIndexData(quizId));

    }, REFRESH_INTERVAL_QUESTION_INDEX);
  
    return () => clearInterval(interval);
  }, [quizId]);

  // Set choice if user already voted
  useEffect(() => {
    if (questionIndex === null || questions === null || votes === null) {
      return;
    }

    const { options } = questions[questionIndex];
    const vote = options[votes[questionIndex]];

    setChoice(vote);
  }, [questionIndex, questions, votes]);



  // Wait until quiz data has been fetched
  if (questionIndex === null || questions === null) {
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
        disabled={choice === '' || playerMustWait}
        choice={choice}
        setChoice={setChoice}
      /> 
    </React.Fragment>
  );
}

export default QuizPage;