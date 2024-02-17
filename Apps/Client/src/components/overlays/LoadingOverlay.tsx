import { useSelector } from '../../hooks/redux';
import './LoadingOverlay.scss';

const LoadingOverlay: React.FC = () => {
  const { text, show } = useSelector(({ overlays }) => overlays.loading);

  return (
    <div id='loading-overlay' className={show ? '' : 'hidden'}>
      <div className='loading-overlay-box'>
        <h2 className='loading-overlay-title'>
          {text}
        </h2>
      </div>
    </div>
  );
};

export default LoadingOverlay;