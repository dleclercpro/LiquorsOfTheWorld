import { ReactNode } from 'react';
import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { mustWaitForOthers, selectQuestionAnswer } from '../../reducers/QuizReducer';
import { hideAnswer } from '../../reducers/OverlaysReducer';
import { setQuestionIndex } from '../../reducers/AppReducer';

interface Props {
  children?: ReactNode,
}

const AnswerOverlay: React.FC<Props> = () => {
  const dispatch = useDispatch();

  const app = useSelector(({ app }) => app);
  const quiz = useSelector(({ quiz }) => quiz);

  const questionIndex = app.questionIndex;
  const questions = quiz.questions.data;
  const answer = useSelector((state) => selectQuestionAnswer(state, questionIndex));

  const shouldShow = useSelector(({ overlays }) => overlays.answer.show);
  const mustWait = useSelector(mustWaitForOthers);

  // Wait until quiz data has been fetched
  if (questions === null) {
    return null;
  }

  const handleClick = () => {
    dispatch(hideAnswer());

    // Update question index in app
    dispatch(setQuestionIndex(questionIndex + 1));
  }

  const nextQuestionIndex = questionIndex + 1;
  const text = nextQuestionIndex >= questions.length ? `See results` : `Next question (${nextQuestionIndex + 1}/${questions.length})`;

  return (
    <div id='answer-overlay' className={shouldShow ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
        <h2 className='answer-overlay-title'>And the answer is...</h2>
        <p className='answer-overlay-text'>{answer}</p>
        {mustWait ? (
          <p className='answer-overlay-wait'>Wait for other players...</p>
        ) : (
          <button className='answer-overlay-buttom' onClick={handleClick}>
            {text}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerOverlay;