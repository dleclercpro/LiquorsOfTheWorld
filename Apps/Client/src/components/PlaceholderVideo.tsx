import React, { useState } from 'react';
import './PlaceholderVideo.scss';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
  className?: string,
  src: string,
  alt: string,
};

const PlaceholderVideo: React.FC<Props> = ({ className, src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  const { t } = useTranslation();

  const showVideo = () => {
    setLoaded(true);
  };

  return (
    <div className={`placeholder-video-container ${className}`}>
      {!loaded && (
        <div className='placeholder'>
          <ImageIcon className='placeholder-icon' />
        </div>
      )}
      <video
        className={`video ${loaded ? 'is-loaded' : ''}`}
        autoPlay
        muted
        loop
        controls
        onLoadedMetadata={showVideo}
      >
        <source src={src} type='video/mp4' />
        {t('ERRORS.NO_VIDEO_TAGS')}
      </video>
    </div>
  );
};

export default PlaceholderVideo;