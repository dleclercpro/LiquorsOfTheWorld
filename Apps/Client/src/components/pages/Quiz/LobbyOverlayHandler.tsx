import React, { useEffect } from 'react';
import useQuiz from '../../../hooks/useQuiz';
import useOverlay from '../../../hooks/useOverlay';
import { OverlayName } from '../../../reducers/OverlaysReducer';
import useUser from '../../../hooks/useUser';

const LobbyOverlayHandler: React.FC = () => {  
  const quiz = useQuiz();
  const user = useUser();
  const lobbyOverlay = useOverlay(OverlayName.Lobby);

  useEffect(() => {
    if (user.isAdmin) return;

    if (!quiz.isStarted && !lobbyOverlay.isOpen) {
      lobbyOverlay.open();
    }

    if (quiz.isStarted && lobbyOverlay.isOpen) {
      lobbyOverlay.close();
    }
  }, [quiz.isStarted, user.isAdmin]);

  return null;
}

export default LobbyOverlayHandler;