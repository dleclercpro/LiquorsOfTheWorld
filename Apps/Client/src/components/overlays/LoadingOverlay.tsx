import React from 'react';
import './LoadingOverlay.scss';
import useOverlay from '../../hooks/useOverlay';
import { OverlayName } from '../../reducers/OverlaysReducer';
import Spinner from '../Spinner';

const LoadingOverlay: React.FC = () => {
  const overlay = useOverlay(OverlayName.Loading);

  if (!overlay.isOpen) {
    return null;
  }

  return (
    <div id='loading-overlay'>
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;