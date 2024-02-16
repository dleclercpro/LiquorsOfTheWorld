import React, { useEffect } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/boxes/QuestionBox';
import { Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../hooks/redux';
import { fetchQuizData } from '../reducers/QuizReducer';

type RouteParams = {
  quizId: string;
};

const QuizPage: React.FC = () => {
  const { quizId } = useParams<RouteParams>();
  const dispatch = useDispatch();
  const { questionIndex, questions } = useSelector(({ quiz }) => quiz);
  const nextQuestionIndex = questionIndex + 1;

  useEffect(() => {
    if (quizId === undefined) {
      return;
    }

    dispatch(fetchQuizData(quizId));
  }, [quizId]);

  // Wait until quiz data has been fetched
  if (questions.length === 0) {
    return null;
  }

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