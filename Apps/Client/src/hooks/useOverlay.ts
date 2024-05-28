import { OverlayName, closeOverlay, openOverlay } from '../reducers/OverlaysReducer';
import { useDispatch, useSelector } from './ReduxHooks';

const useOverlay = (name: OverlayName) => {
  const overlays = useSelector(({ overlays }) => overlays);

  const dispatch = useDispatch();

  const isOpen = overlays[name].open;

  const open = () => {
    dispatch(openOverlay(name));
  }

  const close = () => {
    dispatch(closeOverlay(name));
  }

  return {
    isOpen,
    open,
    close,
  };
};

export default useOverlay;