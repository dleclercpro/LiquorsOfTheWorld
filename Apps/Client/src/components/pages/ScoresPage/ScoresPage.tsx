import React, { useEffect } from 'react';
import './ScoresPage.scss';
import Scoreboard from '../../Scoreboard';
import { useDispatch } from '../../../hooks/ReduxHooks';
import { Navigate } from 'react-router-dom';
import { closeAllOverlays } from '../../../reducers/OverlaysReducer';
import Page from '../Page';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../../hooks/useQuiz';
import { REFRESH_STATUS_INTERVAL } from '../../../config';
import { PageUrl, UserType } from '../../../constants';
import useUser from '../../../hooks/useUser';
import useTimerContext from '../../contexts/TimerContext';

const ScoresPage: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useQuiz();
  const user = useUser();

  const timer = useTimerContext();

  const questionsCount = (quiz.questions ?? []).length;
  const closedAnswersCount = quiz.isOver ? questionsCount : quiz.questionIndex + (timer.isEnabled && timer.isDone ? 1 : 0);

  const regularPlayerUsernames = Object.keys(quiz.scores[UserType.Regular]);
  const adminPlayerUsernames = Object.keys(quiz.scores[UserType.Admin]);

  const hasEitherRegularOrAdminScores = regularPlayerUsernames.length > 0 || adminPlayerUsernames.length > 0;
  const ignoreAdmins = !user.isAdmin;

  // Ensure there are user scores
  const isReady = hasEitherRegularOrAdminScores;



  // Regularly fetch current quiz status from server
  useEffect(() => {
    dispatch(closeAllOverlays());

    const interval = setInterval(quiz.refreshStatusPlayersAndScores, REFRESH_STATUS_INTERVAL);
  
    return () => clearInterval(interval);
  }, []);



  if (!isReady) {
    return null;
  }

  if (!quiz.isStarted) {
    return (
      <Navigate to={PageUrl.Quiz} />
    );
  }

  return (
    <Page title={t('common:COMMON:SCOREBOARD')} className='scores-page'>
      <div className='scores-container'>
        <h2 className='scores-title'>{t('common:COMMON.SCOREBOARD')}</h2>

        <p className='scores-subtitle'>
          {t('common:COMMON.QUIZ')}:
          <strong className='scores-quiz-label'>
            {quiz.id}
          </strong>
        </p>

        <p className='scores-text'>
          {t(quiz.isOver ? 'PAGES.SCOREBOARD.STATUS_OVER' : 'PAGES.SCOREBOARD.STATUS_NOT_OVER', { questionsCount, closedAnswersCount })}
        </p>

        {regularPlayerUsernames.length > 0 && (
          <Scoreboard
            title={!ignoreAdmins ? t('common:COMMON:REGULAR_USERS') : undefined}
            scores={quiz.scores[UserType.Regular]}
            hasMissingPoints={quiz.isTimed}
          />
        )}

        {!ignoreAdmins && adminPlayerUsernames.length > 0 && (
          <Scoreboard
            title={t('common:COMMON:ADMIN_USERS')}
            scores={quiz.scores[UserType.Admin]}
            hasMissingPoints={quiz.isTimed}
          />
        )}
      </div>
    </Page>
  );
};

export default ScoresPage;