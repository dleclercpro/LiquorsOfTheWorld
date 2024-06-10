import React, { useEffect } from 'react';
import useOverlay from '../../../hooks/useOverlay';
import { OverlayName } from '../../../reducers/OverlaysReducer';

type Props = {
  isReady: boolean,
};

const LoadingOverlayHandler: React.FC<Props> = ({ isReady }) => {  
  const loadingOverlay = useOverlay(OverlayName.Loading);

  useEffect(() => {
    if (!isReady && !loadingOverlay.isOpen) {
      loadingOverlay.open();
    }
    if (isReady && loadingOverlay.isOpen) {
      loadingOverlay.close();
    }

  }, [isReady, loadingOverlay.isOpen]);

  return null;
}

export default LoadingOverlayHandler;