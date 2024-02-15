import React from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/boxes/QuestionBox';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../hooks/redux';

const QuizPage: React.FC = () => {
  const quiz = useSelector(({ quiz }) => quiz.data);
  const questionIndex = useSelector(({ quiz }) => quiz.questionIndex);
  const nextQuestionIndex = questionIndex + 1;

  // Wait until quiz data has been fetched
  if (quiz.length === 0) {
    return null;
  }

  if (nextQuestionIndex === quiz.length) {
    return (
      <Navigate to={`/scores`} replace />
    );
  }

  const { theme, question, options } = quiz[questionIndex];

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