import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import { Language } from '../../../constants';

type Props = {
  language: Language,
};

const LanguageChangeHandler: React.FC<Props> = ({ language }) => {  
  const quiz = useQuiz();

  useEffect(() => {
    console.log(`Refreshing question data...`);

    quiz.refreshQuestionData();

  }, [language]);

  return null;
}

export default LanguageChangeHandler;