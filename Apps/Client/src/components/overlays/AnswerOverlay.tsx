import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { mustWaitForOthers, selectAnswer, selectPlayers, selectRightAnswer } from '../../reducers/QuizReducer';
import { hideAnswerOverlay } from '../../reducers/OverlaysReducer';
import { setQuestionIndex } from '../../reducers/AppReducer';
import { useNavigate } from 'react-router-dom';
import RightIcon from '@mui/icons-material/Check';
import WrongIcon from '@mui/icons-material/Close';
import WaitIcon from '@mui/icons-material/Schedule';
import { startQuestion } from '../../actions/QuizActions';
import { useTranslation } from 'react-i18next';

const AnswerOverlay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

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
  if (quiz.id === null || questions === null || status === null || votes === null || players === null) {
    return null;
  }

  const handleSeeNextQuestionButtonClick = () => {
    dispatch(hideAnswerOverlay());

    dispatch(setQuestionIndex(questionIndex + 1));
  }

  const handleStartNextQuestionButtonClick = () => {
    dispatch(hideAnswerOverlay());

    dispatch(startQuestion({
      quizId: quiz.id as string,
      questionIndex: questionIndex + 1,
    }));
  }

  const handleSeeResultsButtonClick = () => {
    dispatch(hideAnswerOverlay());

    navigate('/scores');
  }

  const { isAdmin } = user;
  const { isOver, isSupervised, votesCount } = status;
  const voteCount = votesCount[questionIndex];

  const Icon = isRight ? RightIcon : WrongIcon;
  const iconText = t(isRight ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const title = t('OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount, playersCount: players.length });
  const text = t(isRight ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_TEXT');
  const buttonText = `${t(isAdmin && isSupervised ? 'OVERLAYS.ANSWER.START_NEXT_QUESTION' : 'OVERLAYS.ANSWER.NEXT_QUESTION')} (${questionIndex + 1}/${questions.length})`;
  const handleButtonClick = isAdmin && isSupervised ? handleStartNextQuestionButtonClick : handleSeeNextQuestionButtonClick;

  return (
    <div id='answer-overlay' className={shouldShow ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
          <div>
            <div className='answer-overlay-box-left'>
              {mustWait ? (
                <>
                  <WaitIcon className='answer-overlay-icon wait' />
                  <p className='answer-overlay-title'>{t('OVERLAYS.ANSWER.WAIT_FOR_PLAYERS')}</p>
                </>
              ) : (
                <>
                  <Icon className={`answer-overlay-icon ${isRight ? 'is-right' : 'is-wrong'}`} />
                  <h2 className='answer-overlay-title'>{iconText}</h2>
                </>
              )}
            </div>
            <div className='answer-overlay-box-right'>
              {mustWait ? (
                <>
                  <p className='answer-overlay-title'>{title}</p>
                </>
              ) : (
                <>
                  <p className='answer-overlay-text'>{text}</p>
                  <p className='answer-overlay-value'>{rightAnswer}</p>
                  {!isOver && (!isSupervised || isAdmin) && (
                    <button className='answer-overlay-button' onClick={handleButtonClick}>
                      {buttonText}
                    </button>
                  )}
                  {isOver && (
                    <button className='answer-overlay-button' onClick={handleSeeResultsButtonClick}>
                      {t('OVERLAYS.ANSWER.SEE_RESULTS')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AnswerOverlay;