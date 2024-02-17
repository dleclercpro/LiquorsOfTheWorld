import { useSelector } from '../../hooks/redux';
import './LoadingOverlay.scss';

const LoadingOverlay: React.FC = () => {
  const { show, opaque, text } = useSelector(({ overlays }) => overlays.loading);

  return (
    <div id='loading-overlay' className={`${!show ? 'hidden' : ''} ${opaque ? 'opaque' : ''}`}>
      <div className='loading-overlay-box'>
        <h2 className='loading-overlay-title'>
          {text}
        </h2>
      </div>
    </div>
  );
};

export default LoadingOverlay;