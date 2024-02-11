import { ReactNode, useContext } from 'react';
import './Overlay.scss';
import AppContext from '../states/AppContext';

interface Props {
  children?: ReactNode,
}

const Overlay: React.FC<Props> = ({ children }) => {
  const { currentQuestionId, setCurrentQuestionId, quizData, shouldShowAnswer, hideAnswer } = useContext(AppContext);
  const nextQuestionId = currentQuestionId + 1;

  const questionData = quizData[currentQuestionId];

  const answer = questionData.options[questionData.answer];

  const handleClick = () => {
    hideAnswer();
    setCurrentQuestionId(nextQuestionId);
  }


  const text = nextQuestionId + 1 > quizData.length ? `See results` : `Next question (${nextQuestionId + 1}/${quizData.length})`;

  return (
    <div id='overlay' className={shouldShowAnswer ? '' : 'hidden'}>
      <div className='overlay-box'>
        <h2 className='overlay-title'>And the answer is...</h2>
        <p className='overlay-text'>{answer}</p>
        <button className='overlay-buttom' onClick={handleClick}>
          {text}
        </button>
      </div>
    </div>
  );
};

export default Overlay;