import React from 'react';
import './QuestionFormMedia.scss';
import { SERVER_ROOT } from '../../../config';
import { AspectRatio } from '../../../constants';
import PlaceholderImage from '../../PlaceholderImage';
import PlaceholderVideo from '../../PlaceholderVideo';

export type MediaImage = {
  url: string,
  desc: string,
};

export type MediaVideo = {
  url: string,
  desc: string,
};

type Props = {
  image?: MediaImage,
  video?: MediaVideo,
  ratio: AspectRatio,
}

const QuestionFormMedia: React.FC<Props> = (props) => {
  const { image, video, ratio } = props;

  if ((image && video) || (!image && !video)) {
    throw new Error('Only image OR video!');
  }

  const ratioClass = ratio ? `ratio-${ratio.replace(':', 'x')}` : 'ratio-1x1';
  
  return (
    <section className={`question-form-media ${ratioClass}`}>
      {image && (
        <PlaceholderImage
          className='question-form-media-image'
          src={`${SERVER_ROOT}${image.url}`}
          alt={image.desc}
        />
      )}
      {video && (
        <PlaceholderVideo
          className='question-form-media-video'
          src={`${SERVER_ROOT}${video.url}`}
          alt={video.desc}
        />
      )}
    </section>
  );
};

export default QuestionFormMedia;
