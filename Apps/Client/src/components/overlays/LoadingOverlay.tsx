import React from 'react';
import './LoadingOverlay.scss';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';

const LoadingOverlay: React.FC = () => {
  const overlay = useOverlay(OverlayName.Loading);

  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div id='loading-overlay' className='loading-overlay-container'>
      <div className='loading-icon'></div>
    </div>
  );
};

export default LoadingOverlay;