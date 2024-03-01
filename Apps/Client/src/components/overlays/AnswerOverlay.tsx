import './AnswerOverlay.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { haveAllPlayersAnswered, selectAnswer, selectPlayers, selectCorrectAnswer } from '../../reducers/QuizReducer';
import { closeAnswerOverlay } from '../../reducers/OverlaysReducer';
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

  const playerQuestionIndex = app.questionIndex;
  const questions = quiz.questions.data;
  const status = quiz.status.data;
  const votes = quiz.votes.data;

  const isOpen = useSelector(({ overlays }) => overlays.answer.open);
  const players = useSelector(selectPlayers);

  const answer = useSelector((state) => selectAnswer(state, playerQuestionIndex));
  const correctAnswer = useSelector((state) => selectCorrectAnswer(state, playerQuestionIndex));
  const isAnswerCorrect = answer === correctAnswer;
  const hasEveryoneAnswered = useSelector((state) => haveAllPlayersAnswered(state, playerQuestionIndex));

  // Wait until quiz data has been fetched
  if (quiz.id === null || questions === null || status === null || votes === null || players === null) {
    return null;
  }

  const { isAdmin } = user;
  const { questionIndex, isOver, isSupervised, votesCount } = status;
  const voteCount = votesCount[playerQuestionIndex];
  const isNextQuestionReady = playerQuestionIndex < questionIndex;
  const mustWait = !isAdmin && !isNextQuestionReady;

  const Icon = isAnswerCorrect ? RightIcon : WrongIcon;
  const iconText = t(isAnswerCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const title = t('OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount, playersCount: players.length });
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
                  <p className='answer-overlay-title'>{t('OVERLAYS.ANSWER.PLEASE_WAIT_FOR_NEXT_QUESTION')}</p>
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
                      {t('OVERLAYS.ANSWER.START_NEXT_QUESTION')} {`(${playerQuestionIndex + 1}/${questions.length})`}
                    </button>
                  )}
                  {!isOver && !(isAdmin && isSupervised) && !mustWait && (
                    <button className='answer-overlay-button' onClick={goToNextQuestion}>
                      {t('OVERLAYS.ANSWER.NEXT_QUESTION')} {`(${playerQuestionIndex + 1}/${questions.length})`}
                    </button>
                  )}
                  {isOver && (
                    <button className='answer-overlay-button' onClick={goToScoreboard}>
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