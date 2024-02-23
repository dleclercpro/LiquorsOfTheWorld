import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import { showAnswerOverlay } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';
import { vote } from '../../actions/UserActions';
import { useTranslation } from 'react-i18next';

type Question = {
  index: number,
  question: string,
  theme: string,
  options: string[],
  disabled: boolean,
  choice: string,
  setChoice: (choice: string) => void,
}

const QuestionForm: React.FC<Question> = (props) => {
  const { index, question, theme, options, disabled, choice, setChoice } = props;

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

    dispatch(showAnswerOverlay());
  }

  useEffect(() => {
    setChoice('');

  }, [index]);

  if (questions === null) {
    return null;
  }

  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <div className='question-form-theme-container'>
        <p className='question-form-index'>{t('COMMON.QUESTION')}: {index + 1}/{questions.length}</p>
        <p className='question-form-theme'>{theme}</p>
      </div>

      <h2 className='question-form-title'>{question}</h2>

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
