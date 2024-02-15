import React from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuestionBox from '../components/boxes/QuestionBox';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../hooks/redux';

const QuizPage: React.FC = () => {
  const { questionIndex, questions } = useSelector(({ quiz }) => quiz);
  const nextQuestionIndex = questionIndex + 1;

  // Wait until quiz data has been fetched
  if (questions.length === 0) {
    return null;
  }

  if (nextQuestionIndex === questions.length) {
    return (
      <Navigate to={`/scores`} replace />
    );
  }

  console.log(questionIndex);
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