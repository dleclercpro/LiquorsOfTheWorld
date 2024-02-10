import React from 'react';
import './QuizPage.scss';
import HamburgerMenu from '../components/HamburgerMenu';
import QuizQuestion from '../components/QuizQuestion';

type QuizPageProps = {
  id: number,
  theme: string,
  question: string,
  options: string[],
}

const QuizPage: React.FC<QuizPageProps> = (props) => {
  const { id, theme, question, options } = props;

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