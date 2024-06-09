import './AnswerOverlay.scss';
import { useNavigate } from 'react-router-dom';
import RightIcon from '@mui/icons-material/Check';
import WrongIcon from '@mui/icons-material/Close';
import WaitIcon from '@mui/icons-material/Schedule';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import useApp from '../../hooks/useApp';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';
import useQuestion from '../../hooks/useQuestion';

const AnswerOverlay: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const app = useApp();
  const quiz = useQuiz();
  const user = useUser();

  const appQuestionIndex = app.questionIndex;
  const nextAppQuestionIndex = appQuestionIndex + 1;

  const question = useQuestion(appQuestionIndex);
  const overlay = useOverlay(OverlayName.Answer);



  // Wait until quiz data has been fetched
  const isReady = !(quiz.id === null || quiz.questions === null || quiz.status === null || quiz.players.length === 0 || quiz.status.voteCounts.length === 0);
  if (!isReady) {
    return null;
  }

  const correctAnswer = question.answer.correct;
  const chosenAnswer = question.answer.chosen;

  const voteCount = quiz.status!.voteCounts[appQuestionIndex];
  const playersCount = quiz.players.length;

  const Icon = question.answer.isCorrect ? RightIcon : WrongIcon;
  const iconText = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const currentVoteStatus = t('common:OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount, playersCount });
  const text = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_TEXT');

  const hideAnswer = correctAnswer === null || chosenAnswer === null || (!quiz.isOver && !user.isAdmin && !question.haveAllPlayersAnswered);



  const goToScoreboard = () => {
    overlay.close();

    navigate('/scores');
  }



  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div id='answer-overlay'>
      <div className='answer-overlay-box'>
          <div>
            <div className='answer-overlay-box-left'>
              {hideAnswer ? (
                <>
                  <WaitIcon className='answer-overlay-icon wait' />
                  <p className='answer-overlay-title'>{t('common:OVERLAYS.ANSWER.PLEASE_WAIT_FOR_ALL_PLAYERS')}</p>
                </>
              ) : (
                <>
                  <Icon className={`answer-overlay-icon ${question.answer.isCorrect ? 'is-right' : 'is-wrong'}`} />
                  <h2 className='answer-overlay-title'>{iconText}</h2>
                </>
              )}
            </div>
            <div className='answer-overlay-box-right'>
              {hideAnswer ? (
                <>
                  <p className='answer-overlay-title'>{currentVoteStatus}</p>
                </>
              ) : (
                <>
                  <p className='answer-overlay-text'>{text}</p>
                  <p className='answer-overlay-value'>{correctAnswer.value}</p>
                  <p className='answer-overlay-text'>{currentVoteStatus}</p>

                  {!quiz.isOver && (user.isAdmin && quiz.isSupervised) && (
                    <button className='answer-overlay-button' onClick={question.next.startAndGoTo}>
                      {t('common:OVERLAYS.ANSWER.START_NEXT_QUESTION')} {`(${nextAppQuestionIndex + 1}/${quiz.questions!.length})`}
                    </button>
                  )}
                  {!quiz.isOver && !(user.isAdmin && quiz.isSupervised) && (
                    <button className='answer-overlay-button' disabled={question.next.mustWaitFor} onClick={question.next.goTo}>
                      {question.next.mustWaitFor ? (
                        t('common:OVERLAYS.ANSWER.PLEASE_WAIT_FOR_NEXT_QUESTION')
                      ) : (
                        `${t('common:OVERLAYS.ANSWER.NEXT_QUESTION')} (${nextAppQuestionIndex + 1}/${quiz.questions!.length})`
                      )}
                    </button>
                  )}
                  {quiz.isOver && (
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