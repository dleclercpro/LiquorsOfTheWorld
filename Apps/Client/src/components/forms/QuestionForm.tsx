import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import { openAnswerOverlay } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';
import { vote } from '../../actions/UserActions';
import { useTranslation } from 'react-i18next';
import { SERVER_ROOT } from '../../config';

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
  theme: string,
  question: string,
  image?: Image,
  video?: Video,
  options: string[],
  disabled: boolean,
  choice: string,
  setChoice: (choice: string) => void,
}

const QuestionForm: React.FC<Props> = (props) => {
  const { index, theme, question, image, video, options, disabled, choice, setChoice } = props;

  const { t } = useTranslation();
  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const questions = quiz.questions.data;

  const dispatch = useDispatch();

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

  if (questions === null) {
    return null;
  }

  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <div className='question-form-meta'>
        <p className='question-form-index'>{t('COMMON.QUESTION')}: {index + 1}/{questions.length}</p>
        <p className='question-form-theme'>{theme}</p>
      </div>

      <h2 className='question-form-title'>{question}</h2>

      {image && (
        <img className='question-form-image' src={`${SERVER_ROOT}${image.url}`} alt={image.desc} />
      )}

      {video && (
        <>
          <video className='question-form-image' autoPlay muted loop>
            <source src={`${SERVER_ROOT}${video.url}`} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>
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

      <button type='submit' disabled={disabled}>{t(choice === '' ? 'FORMS.QUESTION.PICK_ANSWER' : 'FORMS.QUESTION.SUBMIT_ANSWER')}</button>
    </form>
  );
};

export default QuestionForm;
