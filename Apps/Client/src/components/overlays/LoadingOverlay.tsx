import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from '../../hooks/useRedux';
import './LoadingOverlay.scss';
import { selectPlayers } from '../../selectors/QuizSelectors';

const LoadingOverlay: React.FC = () => {
  const { t } = useTranslation();

  const { username } = useSelector(({ user }) => user);
  const { open } = useSelector(({ overlays }) => overlays.loading);

  const players = useSelector(selectPlayers);

  if (username === null) {
    return null;
  }

  return (
    <div id='loading-overlay' className={`${!open ? 'hidden' : ''} opaque`}>
      <div className='loading-overlay-box'>
        <h2 className='loading-overlay-title'>
          {t('common:COMMON.PLEASE_WAIT')}...
        </h2>
        <p className='loading-overlay-text'>
          <Trans i18nKey='OVERLAYS.LOADING.HELLO' values={{ username }}>
            ... <strong>...</strong> ...
          </Trans>
          
        </p>
        <ul className='loading-overlay-players-box'>
          {players.map((player, i) => (
            <li key={i}>
              {player}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoadingOverlay;