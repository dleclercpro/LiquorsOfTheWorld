import { ReactNode, useContext } from 'react';
import './Overlay.scss';
import AppContext from '../states/AppContext';

interface Props {
  children?: ReactNode,
}

const Overlay: React.FC<Props> = ({ children }) => {
  const { currentQuestionId, setCurrentQuestionId, quizData, shouldShowAnswer, hideAnswer } = useContext(AppContext);

  const questionData = quizData[currentQuestionId];

  const answer = questionData.options[questionData.answer];

  const handleClick = () => {
    hideAnswer();
    setCurrentQuestionId(currentQuestionId + 1);
  }

  return (
    <div id='overlay' className={shouldShowAnswer ? '' : 'hidden'}>
      <div className='overlay-box'>
        <h2 className='overlay-title'>And the answer is...</h2>
        <p className='overlay-text'>{answer}</p>
        <button className='overlay-buttom' onClick={handleClick}>Next question ({currentQuestionId + 2}/{quizData.length})</button>
      </div>
    </div>
  );
};

export default Overlay;