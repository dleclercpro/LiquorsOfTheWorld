import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import { showAnswer } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';
import { vote } from '../../actions/UserActions';

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

  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  const dispatch = useDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setChoice(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    const res = await dispatch(vote({
      quizId,
      questionIndex: index, // Vote for question that's currently being displayed in the app
      vote: options.findIndex(option => option === choice),
    }));

    if (res.type === 'user/vote/rejected') {
      alert(`Could not vote!`);
      return;
    }

    dispatch(showAnswer());
  }

  useEffect(() => {
    setChoice('');

  }, [index]);

  if (questions === null || votes === null) {
    return null;
  }

  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <div className='question-form-theme-container'>
        <p className='question-form-index'>Question: {index + 1}/{questions.length}</p>
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

      <button type='submit' disabled={disabled}>{choice === '' ? 'Pick an answer' : 'Submit your answer'}</button>
    </form>
  );
};

export default QuestionForm;
