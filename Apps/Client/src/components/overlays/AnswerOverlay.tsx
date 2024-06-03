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

  const overlay = useOverlay(OverlayName.Answer);

  const appQuestionIndex = app.questionIndex;
  const nextAppQuestionIndex = appQuestionIndex + 1;

  const question = useQuestion(appQuestionIndex);



  // Wait until quiz data has been fetched
  if (quiz.id === null || !quiz.questions || !quiz.status || !quiz.status.voteCounts) {
    return null;
  }

  const voteCount = quiz.status.voteCounts[appQuestionIndex];

  const Icon = question.answer.isCorrect ? RightIcon : WrongIcon;
  const iconText = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_ICON_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_ICON_TEXT');

  const currentVoteStatus = t('common:OVERLAYS.ANSWER.CURRENT_STATUS', { voteCount, playersCount: quiz.players.length });
  const text = t(question.answer.isCorrect ? 'OVERLAYS.ANSWER.RIGHT_ANSWER_TEXT' : 'OVERLAYS.ANSWER.WRONG_ANSWER_TEXT');



  const goToScoreboard = () => {
    overlay.close();

    navigate('/scores');
  }

  return (
    <div id='answer-overlay' className={overlay.isOpen ? '' : 'hidden'}>
      <div className='answer-overlay-box'>
          <div>
            <div className='answer-overlay-box-left'>
              {question.next.mustWaitFor ? (
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
              {question.next.mustWaitFor ? (
                <>
                  <p className='answer-overlay-title'>{currentVoteStatus}</p>
                </>
              ) : (
                <>
                  <p className='answer-overlay-text'>{text}</p>
                  <p className='answer-overlay-value'>{question.answer.correct}</p>
                  <p className='answer-overlay-text'>{currentVoteStatus}</p>

                  {!quiz.isOver && (user.isAdmin && quiz.isSupervised) && (
                    <button className='answer-overlay-button' onClick={question.next.startAndGoTo}>
                      {t('common:OVERLAYS.ANSWER.START_NEXT_QUESTION')} {`(${nextAppQuestionIndex + 1}/${quiz.questions.length})`}
                    </button>
                  )}
                  {!quiz.isOver && !(user.isAdmin && quiz.isSupervised) && !question.next.mustWaitFor && (
                    <button className='answer-overlay-button' onClick={question.next.goTo}>
                      {t('common:OVERLAYS.ANSWER.NEXT_QUESTION')} {`(${nextAppQuestionIndex + 1}/${quiz.questions.length})`}
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