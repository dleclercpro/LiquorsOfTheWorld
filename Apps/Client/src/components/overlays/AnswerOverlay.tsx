import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { mustWaitForOthers, selectQuestionAnswer } from '../../reducers/QuizReducer';
import { hideAnswer } from '../../reducers/OverlaysReducer';
import { setQuestionIndex } from '../../reducers/AppReducer';
import { useNavigate } from 'react-router-dom';

const AnswerOverlay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const app = useSelector(({ app }) => app);
  const quiz = useSelector(({ quiz }) => quiz);

  const questionIndex = app.questionIndex;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const answer = useSelector((state) => selectQuestionAnswer(state, questionIndex));

  const shouldShow = useSelector(({ overlays }) => overlays.answer.show);
  const mustWait = useSelector(mustWaitForOthers);

  // Wait until quiz data has been fetched
  if (questions === null || status === null) {
    return null;
  }

  const { isOver } = status;

  const handleButtonClick = () => {
    dispatch(hideAnswer());

    if (isOver) {
      navigate('/scores');
    } else {
      dispatch(setQuestionIndex(questionIndex + 1));
    }
  }

  const text = isOver ? `See results` : `Next question (${questionIndex + 1}/${questions.length})`;

  return (
    <div id='answer-overlay' className={shouldShow ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
        {mustWait ? (
          <p className='answer-overlay-title'>Please wait for other players to answer the question...</p>
        ) : (
          <>
            <h2 className='answer-overlay-title'>And the correct answer is...</h2>
            <p className='answer-overlay-text'>{answer}</p>
            <button className='answer-overlay-button' onClick={handleButtonClick}>
              {text}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerOverlay;