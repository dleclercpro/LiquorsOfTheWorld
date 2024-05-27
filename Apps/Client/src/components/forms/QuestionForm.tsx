import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import { openAnswerOverlay } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';
import { vote } from '../../actions/QuizActions';
import { useTranslation } from 'react-i18next';
import { SERVER_ROOT } from '../../config';
import { AspectRatio } from '../../constants';
import PlaceholderImage from '../PlaceholderImage';
import PlaceholderVideo from '../PlaceholderVideo';
import TimeDuration from '../../models/TimeDuration';
import { TimeUnit } from '../../types/TimeTypes';

type Image = {
  url: string,
  desc: string,
};

type Video = {
  url: string,
  desc: string,
};

type Props = {
  index: number,
  topic: string,
  question: string,
  image?: Image,
  video?: Video,
  ratio?: AspectRatio,
  options: string[],
  disabled: boolean,
  choice: string,
  setChoice: (choice: string) => void,
}

const QuestionForm: React.FC<Props> = (props) => {
  const { index, topic, question, image, video, ratio, options, disabled, choice, setChoice } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const status = quiz.status.data;
  const questions = quiz.questions.data;

  const hasMedia = image || video;
  const ratioClass = ratio ? `ratio-${ratio.replace(':', 'x')}` : 'ratio-1x1';

  const isTimed = quiz.status.data?.isTimed;
  const timer = { remainingTime: new TimeDuration(5, TimeUnit.Second) };


  
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setChoice(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    const result = await dispatch(vote({
      quizId,
      questionIndex: index, // Vote for question that's currently being displayed in the app
      vote: options.findIndex(option => option === choice),
    }));

    if (result.type.endsWith('/rejected')) {
      alert(`Could not vote!`);
      return;
    }

    dispatch(openAnswerOverlay());
  }

  useEffect(() => {
    setChoice('');

  }, [index]);

  if (questions === null || status === null) {
    return null;
  }

  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <div className='question-form-meta'>
        {isTimed && (
          <p className='question-form-timer'>{t('common:COMMON.TIME_LEFT')}: <span className='question-form-timer-value'>{timer.remainingTime.format()}</span></p>
        )}
        <p className='question-form-index'>{t('common:COMMON.QUESTION')}: {index + 1}/{questions.length}</p>
        <p className='question-form-topic'>{t('common:COMMON.TOPIC')}: {topic}</p>
      </div>

      <h2 className='question-form-title'>{question}</h2>

      {hasMedia && (
        <div className={`question-form-media-container ${ratioClass}`}>
          {image && (
            <PlaceholderImage
              className='question-form-image'
              src={`${SERVER_ROOT}${image.url}`}
              alt={image.desc}
            />
          )}
          {video && (
            <PlaceholderVideo
              className='question-form-video'
              src={`${SERVER_ROOT}${video.url}`}
              alt={video.desc}
            />
          )}
        </div>
      )}

      {options.map((option, i) => (
        <div className='checkbox' key={i}>
          <input
            type='radio'
            id={`option-${i}`}
            name='option'
            value={option}
            checked={choice === option}
            onChange={handleChange}
          />
          <label htmlFor={`option-${i}`}>{option}</label>
        </div>
      ))}

      <button type='submit' disabled={disabled}>
        {t(choice === '' ? 'FORMS.QUESTION.PICK_ANSWER' : 'FORMS.QUESTION.SUBMIT_ANSWER')}{isTimed ? ` (${timer.remainingTime.format()})` : ''}
      </button>
    </form>
  );
};

export default QuestionForm;
