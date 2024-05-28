import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import { closeAnswerOverlay } from '../../reducers/OverlaysReducer';
import { setQuestionIndex } from '../../reducers/AppReducer';
import { useNavigate } from 'react-router-dom';
import RightIcon from '@mui/icons-material/Check';
import WrongIcon from '@mui/icons-material/Close';
import WaitIcon from '@mui/icons-material/Schedule';
import { startQuestion } from '../../actions/QuizActions';
import { useTranslation } from 'react-i18next';
import { selectAnswer, selectCorrectAnswer } from '../../selectors/QuizSelectors';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import useApp from '../../hooks/useApp';

const AnswerOverlay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const app = useApp();
  const user = useUser();

  const quiz = useQuiz();

  const playerQuestionIndex = app.playerQuestionIndex;
  const nextPlayerQuestionIndex = playerQuestionIndex + 1;

  const isOpen = useSelector(({ overlays }) => overlays.answer.open);

  const answer = useSelector((state) => selectAnswer(state, playerQuestionIndex));
  const correctAnswer = useSelector((state) => selectCorrectAnswer(state, playerQuestionIndex));
  const isAnswerCorrect = answer === correctAnswer;

  // Wait until quiz data has been fetched
  if (quiz.id === null || quiz.questions === null || quiz.status === null || quiz.votes === null || quiz.players.length === 0) {
    return null;
  }

  const { isAdmin } = user;
  const { questionIndex, isOver, isSupervised, votesCount } = quiz.status;
  const voteCount = votesCount[playerQuestionIndex];
  const isNextQuestionReady = playerQuestionIndex < questionIndex;
  const mustWait = !isAdmin && !isNextQuestionReady;

  const Icon = isAnswerCorrect ? RightIcon : WrongIcon;
  const iconText = t(isAnswerCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const title = t('common:OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount, playersCount: quiz.players.length });
  const text = t(isAnswerCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_TEXT');



  const goToNextQuestion = () => {
    dispatch(closeAnswerOverlay());

    dispatch(setQuestionIndex(playerQuestionIndex + 1));
  }

  const startAndGoToNextQuestion = () => {
    dispatch(closeAnswerOverlay());

    dispatch(startQuestion({
      quizId: quiz.id as string,
      questionIndex: playerQuestionIndex + 1,
    }));
  }

  const goToScoreboard = () => {
    dispatch(closeAnswerOverlay());

    navigate('/scores');
  }

  return (
    <div id='answer-overlay' className={isOpen ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
          <div>
            <div className='answer-overlay-box-left'>
              {mustWait ? (
                <>
                  <WaitIcon className='answer-overlay-icon wait' />
                  <p className='answer-overlay-title'>{t('common:OVERLAYS.ANSWER.PLEASE_WAIT_FOR_NEXT_QUESTION')}</p>
                </>
              ) : (
                <>
                  <Icon className={`answer-overlay-icon ${isAnswerCorrect ? 'is-right' : 'is-wrong'}`} />
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
                  <p className='answer-overlay-value'>{correctAnswer}</p>

                  {!isOver && (isAdmin && isSupervised) && (
                    <button className='answer-overlay-button' onClick={startAndGoToNextQuestion}>
                      {t('common:OVERLAYS.ANSWER.START_NEXT_QUESTION')} {`(${nextPlayerQuestionIndex + 1}/${quiz.questions.length})`}
                    </button>
                  )}
                  {!isOver && !(isAdmin && isSupervised) && !mustWait && (
                    <button className='answer-overlay-button' onClick={goToNextQuestion}>
                      {t('common:OVERLAYS.ANSWER.NEXT_QUESTION')} {`(${nextPlayerQuestionIndex + 1}/${quiz.questions.length})`}
                    </button>
                  )}
                  {isOver && (
                    <button className='answer-overlay-button' onClick={goToScoreboard}>
                      {t('common:OVERLAYS.ANSWER.SEE_RESULTS')}
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