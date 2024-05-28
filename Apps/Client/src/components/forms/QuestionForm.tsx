import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks/useRedux';
import { openAnswerOverlay } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';
import { vote } from '../../actions/QuizActions';
import { useTranslation } from 'react-i18next';
import { QUIZ_TIMER_URGENT_TIME, SERVER_ROOT } from '../../config';
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
  remainingTime?: TimeDuration,
  disabled: boolean,
  choice: string,
  setChoice: (choice: string) => void,
}

const QuestionForm: React.FC<Props> = (props) => {
  const { index, topic, question, image, video, ratio, options, remainingTime, disabled, choice, setChoice } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const status = quiz.status.data;
  const questions = quiz.questions.data;

  const hasMedia = image || video;
  const ratioClass = ratio ? `ratio-${ratio.replace(':', 'x')}` : 'ratio-1x1';


  
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
        {remainingTime && (
          <p className={`question-form-timer ${remainingTime.smallerThan(QUIZ_TIMER_URGENT_TIME) ? 'urgent' : ''}`}>
            {t('common:COMMON.TIME_LEFT')}:
            <span className='question-form-timer-value'>
              {remainingTime.format(TimeUnit.Second)}
            </span>
          </p>
        )}
        <p className='question-form-index'>
          {t('common:COMMON.QUESTION')}:
          <span className='question-form-index-value'>
            {index + 1}/{questions.length}
          </span>
        </p>
        <p className='question-form-topic'>
          {t('common:COMMON.TOPIC')}:
          <span className='question-form-topic-value'>
            {topic}
          </span>
        </p>
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
        {t(choice === '' ? 'FORMS.QUESTION.PICK_ANSWER' : 'FORMS.QUESTION.SUBMIT_ANSWER')}{remainingTime ? ` (${remainingTime.format()})` : ''}
      </button>
    </form>
  );
};

export default QuestionForm;
