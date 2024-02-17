import React, { useEffect } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/boxes/QuestionBox';
import { Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../hooks/redux';
import { fetchQuestionIndexData, fetchQuizData } from '../reducers/QuizReducer';
import { REFRESH_INTERVAL_QUESTION_INDEX } from '../config';

type RouteParams = {
  quizId: string;
};

const QuizPage: React.FC = () => {
  const { quizId } = useParams<RouteParams>();
  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const questionIndex = quiz.questionIndex.data;
  const questions = quiz.questions.data;

  // Fetch quiz data
  useEffect(() => {
    dispatch(fetchQuizData());
  }, []);

  // Fetch current question index
  useEffect(() => {
    if (quizId === undefined) {
      return;
    }

    dispatch(fetchQuestionIndexData(quizId));
  }, [quizId]);

  // Regularly fetch current question index (will change as players vote)
  useEffect(() => {
    if (quizId === undefined) {
      return;
    }

    const interval = setInterval(async () => {
      await dispatch(fetchQuestionIndexData(quizId));
    }, REFRESH_INTERVAL_QUESTION_INDEX);

    return () => clearInterval(interval);
  }, [quizId]);

  // Wait until quiz data has been fetched
  if (questionIndex === null || questions.length === 0) {
    return null;
  }

  const nextQuestionIndex = questionIndex + 1;
  if (nextQuestionIndex === questions.length) {
    return (
      <Navigate to={`/scores`} replace />
    );
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