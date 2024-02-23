import { useTranslation } from 'react-i18next';
import { useSelector } from '../../hooks/redux';
import './LoadingOverlay.scss';

const LoadingOverlay: React.FC = () => {
  const { t } = useTranslation();

  const { username } = useSelector(({ user }) => user);
  const { show } = useSelector(({ overlays }) => overlays.loading);

  if (username === null) {
    return null;
  }

  return (
    <div id='loading-overlay' className={`${!show ? 'hidden' : ''} opaque`}>
      <div className='loading-overlay-box'>
        <h2 className='loading-overlay-title'>
          {t('OVERLAYS.LOADING.PLEASE_WAIT', { username })}
        </h2>
      </div>
    </div>
  );
};

export default LoadingOverlay;