import { useTranslation } from 'react-i18next';
import { useSelector } from '../../hooks/redux';
import './LoadingOverlay.scss';
import { selectPlayers } from '../../reducers/QuizReducer';

const LoadingOverlay: React.FC = () => {
  const { t } = useTranslation();

  const { username } = useSelector(({ user }) => user);
  const { show } = useSelector(({ overlays }) => overlays.loading);

  const players = useSelector(selectPlayers);

  if (username === null) {
    return null;
  }

  return (
    <div id='loading-overlay' className={`${!show ? 'hidden' : ''} opaque`}>
      <div className='loading-overlay-box'>
        <h2 className='loading-overlay-title'>
          {t('OVERLAYS.LOADING.PLEASE_WAIT')}
        </h2>
        <p className='loading-overlay-text'>
          Hello, <strong>{username}</strong>! The quiz will begin shortly. Here is the list of participants:
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