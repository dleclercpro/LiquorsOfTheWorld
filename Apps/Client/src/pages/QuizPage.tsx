import React, { useContext } from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/HamburgerMenu';
import QuizQuestion from '../components/QuizQuestion';
import AppContext from '../states/AppContext';
import { useNavigate } from 'react-router-dom';

type QuizPageProps = {
  id: number,
  theme: string,
  question: string,
  options: string[],
}

const QuizPage: React.FC<QuizPageProps> = (props) => {
  const { id, theme, question, options } = props;
  const { currentQuestionId, quizData } = useContext(AppContext);
  const navigate = useNavigate();

  if (currentQuestionId + 1 === quizData.length) {
    navigate(`/scores`);
  }

  return (
    <React.Fragment>
      <HamburgerMenu />
      <QuizQuestion
        id={id}
        theme={theme}
        question={question}
        options={options}
      /> 
    </React.Fragment>
  );
}

export default QuizPage;