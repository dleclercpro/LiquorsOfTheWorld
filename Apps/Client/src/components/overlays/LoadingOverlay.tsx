import { Trans, useTranslation } from 'react-i18next';
import './LoadingOverlay.scss';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';

const LoadingOverlay: React.FC = () => {
  const { t } = useTranslation();

  const quiz = useQuiz();
  const user = useUser();

  const overlay = useOverlay(OverlayName.Loading);

  const username = user.username ?? '';

  return (
    <div id='loading-overlay' className={`${!overlay.isOpen ? 'hidden' : ''} opaque`}>
      <div className='loading-overlay-box'>
        <h2 className='loading-overlay-title'>
          {t('common:COMMON.PLEASE_WAIT')}...
        </h2>

        {quiz.players.length > 0 && (<>
          <p className='loading-overlay-text'>
            <Trans i18nKey='OVERLAYS.LOADING.HELLO' values={{ username }}>
              ... <strong>...</strong> ...
            </Trans>
          </p>
          <ul className='loading-overlay-players-box'>
            {quiz.players.map((player, i) => (
              <li key={i}>
                {player.username}
              </li>
            ))}
          </ul>
        </>)}
      </div>
    </div>
  );
};

export default LoadingOverlay;