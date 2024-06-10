import { Trans, useTranslation } from 'react-i18next';
import './LobbyOverlay.scss';
import useQuiz from '../../hooks/useQuiz';
import useUser from '../../hooks/useUser';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';

const LobbyOverlay: React.FC = () => {
  const { t } = useTranslation();

  const quiz = useQuiz();
  const user = useUser();

  const regularPlayers = quiz.players.filter((player) => !player.isAdmin);

  const overlay = useOverlay(OverlayName.Lobby);

  const username = user.username ?? '';

  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div id='lobby-overlay'>
      <div className='lobby-overlay-box'>
        <p className='lobby-overlay-title'>
          <Trans i18nKey='OVERLAYS.LOBBY.TITLE' values={{ username }}>
            ... <strong>...</strong> ...
          </Trans>
        </p>

        <p className='lobby-overlay-text'>
          {t('OVERLAYS.LOBBY.TEXT', { id: quiz.id })}
        </p>

        {regularPlayers.length > 0 && (
          <ul className='lobby-overlay-players-box'>
            {regularPlayers.map((player, i) => (
              <li key={i}>
                {player.username}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LobbyOverlay;