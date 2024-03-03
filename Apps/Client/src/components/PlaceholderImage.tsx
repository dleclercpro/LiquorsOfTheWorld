import React, { useState } from 'react';
import './PlaceholderImage.scss';
import ImageIcon from '@mui/icons-material/Image';

type Props = {
  className?: string,
  src: string,
  alt: string,
};

const PlaceholderImage: React.FC<Props> = ({ className, src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  const showVideo = () => {
    setLoaded(true);
  };

  return (
    <div className={`placeholder-image-container ${className}`}>
      {!loaded && (
        <div className='placeholder'>
          <ImageIcon className='placeholder-icon' />
        </div>
      )}
      <img
        className={`image ${loaded ? 'is-loaded' : ''}`}
        src={src}
        alt={alt}
        onLoad={showVideo}
      />
    </div>
  );
};

export default PlaceholderImage;