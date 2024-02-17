import { ReactNode } from 'react';
import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { selectQuestionAnswer } from '../../reducers/QuizReducer';
import { hideAnswer } from '../../reducers/OverlaysReducer';

interface Props {
  children?: ReactNode,
}

const AnswerOverlay: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const answer = useSelector(selectQuestionAnswer);
  const questionIndex = quiz.questionIndex.data;
  const questions = quiz.questions.data;

  const shouldShow = useSelector(({ overlays }) => overlays.answer.show);

  // Wait until quiz data has been fetched
  if (questionIndex === null || questions.length === 0) {
    return null;
  }

  const handleClick = () => {
    dispatch(hideAnswer());
  }

  const nextQuestionIndex = questionIndex + 1;
  const text = nextQuestionIndex + 1 > questions.length ? `See results` : `Next question (${nextQuestionIndex + 1}/${questions.length})`;

  return (
    <div id='answer-overlay' className={shouldShow ? '' : 'hidden'}>
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