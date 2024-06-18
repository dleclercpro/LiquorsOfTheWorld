import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from '../../../hooks/ReduxHooks';
import './QuestionForm.scss';
import { voteAction } from '../../../actions/QuizActions';
import { useTranslation } from 'react-i18next';
import { AspectRatio } from '../../../constants';
import TimeDuration from '../../../models/TimeDuration';
import useQuiz from '../../../hooks/useQuiz';
import useOverlay from '../../../hooks/useOverlay';
import { OverlayName } from '../../../reducers/OverlaysReducer';
import QuestionFormMeta from './QuestionFormMeta';
import QuestionFormMedia, { MediaImage, MediaVideo } from './QuestionFormMedia';
import { shuffle } from '../../../utils/array';

type Props = {
  index: number,
  topic: string,
  question: string,
  image?: MediaImage,
  video?: MediaVideo,
  ratio?: AspectRatio,
  options: string[],
  remainingTime?: TimeDuration,
  disableSubmit: boolean,
  choice: string,
  setChoice: (choice: string) => void,
}

const QuestionForm: React.FC<Props> = (props) => {
  const { index, topic, question, image, video, ratio, options, remainingTime, disableSubmit, choice, setChoice } = props;

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const quiz = useQuiz();

  const answerOverlay = useOverlay(OverlayName.Answer);



  const sendVote = useCallback(async () => {
    if (quiz.id === null) {
      return;
    }

    const result = await dispatch(voteAction({
      quizId: quiz.id,
      questionIndex: index, // Vote for question that's currently being displayed in the app
      vote: options.findIndex(option => option === choice),
    }));

    if (result.type.endsWith('/rejected')) {
      return false;
    }

    return true;
  }, [quiz.id, index, options, choice]);


  
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setChoice(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (await sendVote()) {
      answerOverlay.open();
    }
  }



  // Reset choice when changing question
  useEffect(() => {
    setChoice('');

  }, [index]);


  
  // Randomize options order on load
  const randomizedOptions = useMemo(() => shuffle(options), [options]);



  if (quiz.questions === null || quiz.status === null) {
    return null;
  }



  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <QuestionFormMeta
        questionIndex={index}
        questionsCount={quiz.questions.length}
        remainingTime={remainingTime}
        topic={topic}
      />

      <h2 className='question-form-title'>{question}</h2>

      {ratio && (image || video) && (
        <QuestionFormMedia
          image={image}
          video={video}
          ratio={ratio}
        />
      )}

      {randomizedOptions.map((option, i) => {
        const disabled = remainingTime ? remainingTime.isZero() : false;
        
        return (
          <div className='checkbox' key={i}>
            <input
              type='radio'
              id={`option-${i}`}
              name='option'
              value={option}
              checked={choice === option}
              onChange={handleChange}
              disabled={disabled}
            />
            <label className={`label ${disabled ? 'disabled' : ''}`} htmlFor={`option-${i}`}>{option}</label>
          </div>
        );
      })}

      <button type='submit' disabled={disableSubmit}>
        {t(choice === '' ? 'FORMS.QUESTION.PICK_ANSWER' : 'FORMS.QUESTION.SUBMIT_ANSWER')}{remainingTime ? ` (${remainingTime.format()})` : ''}
      </button>
    </form>
  );
};

export default QuestionForm;
