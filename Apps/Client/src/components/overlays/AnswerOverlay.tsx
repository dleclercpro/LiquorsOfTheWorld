import './AnswerOverlay.scss';
import { useDispatch } from '../../hooks/useRedux';
import { setQuestionIndex } from '../../reducers/AppReducer';
import { useNavigate } from 'react-router-dom';
import RightIcon from '@mui/icons-material/Check';
import WrongIcon from '@mui/icons-material/Close';
import WaitIcon from '@mui/icons-material/Schedule';
import { startQuestion } from '../../actions/QuizActions';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import useApp from '../../hooks/useApp';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';
import useQuestion from '../../hooks/useQuestion';

const AnswerOverlay: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();

  const overlay = useOverlay(OverlayName.Answer);

  const playerQuestionIndex = app.playerQuestionIndex;
  const nextPlayerQuestionIndex = playerQuestionIndex + 1;

  const question = useQuestion(playerQuestionIndex);

  // Wait until quiz data has been fetched
  if (quiz.id === null || quiz.questions === null || quiz.status === null || quiz.votes === null || quiz.players.length === 0) {
    return null;
  }

  const { isAdmin } = user;
  const { questionIndex, isOver, isSupervised, votesCount } = quiz.status;
  const voteCount = votesCount[playerQuestionIndex];
  const isNextQuestionReady = playerQuestionIndex < questionIndex;
  const mustWait = !isAdmin && !isNextQuestionReady;

  const Icon = question.answer.isCorrect ? RightIcon : WrongIcon;
  const iconText = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const title = t('common:OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount, playersCount: quiz.players.length });
  const text = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_TEXT');



  const goToNextQuestion = () => {
    overlay.close();

    dispatch(setQuestionIndex(playerQuestionIndex + 1));
  }

  const startAndGoToNextQuestion = () => {
    overlay.close();

    dispatch(startQuestion({
      quizId: quiz.id as string,
      questionIndex: playerQuestionIndex + 1,
    }));
  }

  const goToScoreboard = () => {
    overlay.close();

    navigate('/scores');
  }

  return (
    <div id='answer-overlay' className={overlay.isOpen ? '' : 'hidden'}>
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
                  <Icon className={`answer-overlay-icon ${question.answer.isCorrect ? 'is-right' : 'is-wrong'}`} />
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
                  <p className='answer-overlay-value'>{question.correctAnswer.value}</p>

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