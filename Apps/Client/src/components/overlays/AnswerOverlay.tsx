import { ReactNode } from 'react';
import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { hideAnswer, incrementQuestionIndex, selectQuestionAnswer } from '../../reducers/QuizReducer';

interface Props {
  children?: ReactNode,
}

const AnswerOverlay: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const shouldShowAnswer = useSelector(({ quiz }) => quiz.shouldShowAnswer);
  const quiz = useSelector(({ quiz }) => quiz.data);
  const questionIndex = useSelector(({ quiz }) => quiz.questionIndex);
  const nextQuestionIndex = questionIndex + 1;
  const answer = useSelector(selectQuestionAnswer);

  // Wait until quiz data has been fetched
  if (quiz.length === 0) {
    return null;
  }

  const handleClick = () => {
    dispatch(hideAnswer());
    dispatch(incrementQuestionIndex());
  }

  const text = nextQuestionIndex + 1 > quiz.length ? `See results` : `Next question (${nextQuestionIndex + 1}/${quiz.length})`;

  return (
    <div id='answer-overlay' className={shouldShowAnswer ? '' : 'hidden'}>
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