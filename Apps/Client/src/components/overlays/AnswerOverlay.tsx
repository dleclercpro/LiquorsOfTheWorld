import { ReactNode, useContext } from 'react';
import './AnswerOverlay.scss';
import AppContext from '../../contexts/AppContext';

interface Props {
  children?: ReactNode,
}

const AnswerOverlay: React.FC<Props> = () => {
  const { questionIndex, setQuestionIndex, quiz, shouldShowAnswer, hideAnswer } = useContext(AppContext);
  const nextQuestionIndex = questionIndex + 1;

  // Wait until quiz data has been fetched
  if (quiz.length === 0) {
    return null;
  }

  const question = quiz[questionIndex];
  const answer = question.options[question.answer];

  const handleClick = () => {
    hideAnswer();
    setQuestionIndex(nextQuestionIndex);
  }

  const text = nextQuestionIndex + 1 > quiz.length ? `See results` : `Next question (${nextQuestionIndex + 1}/${quiz.length})`;

  return (
    <div id='overlay' className={shouldShowAnswer ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
        <h2 className='answer-overlay-title'>And the answer is...</h2>
        <p className='answer-overlay-text'>{answer}</p>
        <button className='answer-overlay-buttom' onClick={handleClick}>
          {text}
        </button>
      </div>
    </div>
  );
};

export default AnswerOverlay;