import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { mustWaitForOthers, selectAnswer, selectPlayers, selectRightAnswer } from '../../reducers/QuizReducer';
import { hideAnswer } from '../../reducers/OverlaysReducer';
import { setQuestionIndex } from '../../reducers/AppReducer';
import { useNavigate } from 'react-router-dom';
import RightIcon from '@mui/icons-material/Check';
import WrongIcon from '@mui/icons-material/Clear';
import WaitIcon from '@mui/icons-material/Schedule';

const AnswerOverlay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const app = useSelector(({ app }) => app);
  const quiz = useSelector(({ quiz }) => quiz);
  const user = useSelector(({ user }) => user);

  const questionIndex = app.questionIndex;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const votes = quiz.votes.data;

  const players = useSelector((state) => selectPlayers(state));

  const rightAnswer = useSelector((state) => selectRightAnswer(state, questionIndex));
  const answer = useSelector((state) => selectAnswer(state, questionIndex));
  const isRight = answer === rightAnswer;

  const shouldShow = useSelector(({ overlays }) => overlays.answer.show);
  const mustWait = useSelector(mustWaitForOthers);

  // Wait until quiz data has been fetched
  if (questions === null || status === null || votes === null || players === null) {
    return null;
  }

  console.log(status);
  const { isOver, votesCount } = status;
  const voteCount = votesCount[questionIndex];

  const handleButtonClick = () => {
    dispatch(hideAnswer());

    if (isOver) {
      navigate('/scores');
    } else {
      dispatch(setQuestionIndex(questionIndex + 1));
    }
  }

  const isAdmin = user.isAdmin;
  const Icon = isRight ? RightIcon : WrongIcon;
  const buttonText = isOver ? `See results` : `Next question (${questionIndex + 1}/${questions.length})`;
  const adminText = 'The correct answer was:';
  const userText = `${isRight ? 'Indeed' : 'Actually'}, the correct answer was:`;

  return (
    <div id='answer-overlay' className={shouldShow ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
          <div>
            <div className='answer-overlay-box-left'>
              {!mustWait ? (
                <>
                  <Icon className={`answer-overlay-icon ${isRight ? 'is-right' : 'is-wrong'}`} />
                  <h2 className='answer-overlay-title'>{`You're ${isRight ? 'right!' : 'wrong...'}`}</h2>
                </>
              ) : (
                <>
                  <WaitIcon className='answer-overlay-icon wait' />
                  <p className='answer-overlay-title'>Please wait for other players to answer the question...</p>
                </>
              )}
            </div>
            <div className='answer-overlay-box-right'>
              {!mustWait ? (
                <>
                  <p className='answer-overlay-text'>{isAdmin ? adminText : userText}</p>
                  <p className='answer-overlay-value'>{rightAnswer}</p>
                  <button className='answer-overlay-button' onClick={handleButtonClick}>
                    {buttonText}
                  </button>
                </>
              ) : (
                <>
                  <p className='answer-overlay-title'>So far, <strong>{voteCount} out of {players.length}</strong> players have voted.</p>
                </>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AnswerOverlay;