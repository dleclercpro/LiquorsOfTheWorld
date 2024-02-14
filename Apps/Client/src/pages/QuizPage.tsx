import React, { useContext } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/menus/HamburgerMenu';
import QuizBox from '../components/boxes/QuizBox';
import AppContext from '../contexts/AppContext';
import { Navigate } from 'react-router-dom';

const QuizPage: React.FC = () => {
  const { questionIndex, quiz } = useContext(AppContext);
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
      <QuizBox
        index={questionIndex}
        theme={theme}
        question={question}
        options={options}
      /> 
    </React.Fragment>
  );
}

export default QuizPage;