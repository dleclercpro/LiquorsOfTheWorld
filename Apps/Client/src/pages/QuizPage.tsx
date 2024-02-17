import React, { useEffect } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/forms/QuestionForm';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../hooks/redux';
import { fetchQuestionIndexData, fetchQuizData, fetchScores, fetchVotes } from '../reducers/QuizReducer';
import { REFRESH_INTERVAL_QUESTION_INDEX } from '../config';
import { hideLoading, showLoading } from '../reducers/OverlaysReducer';

const QuizPage: React.FC = () => {
  const quizId = useSelector((state) => state.quiz.id);

  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const questionIndex = quiz.questionIndex.data;
  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  let playerMustWait = false;
  if (questionIndex !== null && votes !== null) {
    playerMustWait = votes.length === questionIndex + 1;
  }

  // Show waiting screen when others need to vote
  useEffect(() => {
    if (playerMustWait) {
      dispatch(showLoading({
        text: `Wait for others to vote...`,
        opaque: false,
      }));
    } else {
      dispatch(hideLoading());
    }

  }, [playerMustWait]);

  // Fetch quiz data
  useEffect(() => {
    dispatch(fetchQuizData());
  }, []);

  // Fetch user's votes
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchVotes(quizId));
  }, [quizId]);

  // Fetch current scores
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchScores(quizId));
  }, [quizId]);

  // Fetch current question index
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    dispatch(fetchQuestionIndexData(quizId));
  }, [quizId]);

  // Regularly fetch current question index (will change as players vote)
  useEffect(() => {
    if (quizId === null) {
      return;
    }

    const interval = setInterval(async () => {
      await dispatch(fetchQuestionIndexData(quizId));
    }, REFRESH_INTERVAL_QUESTION_INDEX);

    return () => clearInterval(interval);
  }, [quizId]);

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
      /> 
    </React.Fragment>
  );
}

export default QuizPage;