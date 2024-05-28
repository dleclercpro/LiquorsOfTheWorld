import { OverlayName, closeOverlay, openOverlay } from '../reducers/OverlaysReducer';
import { useDispatch, useSelector } from './useRedux';

const useOverlay = (overlayName: OverlayName) => {
  const overlays = useSelector(({ overlays }) => overlays);

  const dispatch = useDispatch();

  const isOpen = overlays[overlayName].open;

  const open = () => {
    dispatch(openOverlay(overlayName));
  }

  const close = () => {
    dispatch(closeOverlay(overlayName));
  }

  return {
    isOpen,
    open,
    close,
  };
};

export default useOverlay;