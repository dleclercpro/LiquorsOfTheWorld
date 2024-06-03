import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../hooks/ReduxHooks';
import './LoginForm.scss';
import { login } from '../../actions/AuthActions';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../hooks/useQuiz';

type Props = {
  quizId: string | null,
  teamId: string | null,
}

const LoginForm: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const quiz = useQuiz();

  const [quizId] = useState(props.quizId ?? '');
  const [teamId] = useState(props.teamId ?? '');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const auth = useSelector((state) => state.auth);


  
  // Redirect to current quiz question on successful login
  useEffect(() => {
    if (auth.status === 'succeeded' && auth.isAuthenticated) {
      navigate(`/quiz`);
    }
  }, [auth.status]);

  // Display authentication error to user
  useEffect(() => {
    if (auth.status === 'failed' && auth.error) {
      setError(auth.error);
    }
  }, [auth.status, auth.error]);



  // Send login data to server
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quiz.name === null) {
      return;
    }

    await dispatch(login({ quizName: quiz.name, quizId, teamId, username, password }));
  };

  return (
    <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
      <input
        id='login-username'
        type='text'
        value={username}
        placeholder={t('common:FORMS.LOGIN.USERNAME')}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        id='login-password'
        type='password'
        value={password}
        placeholder={t('common:FORMS.LOGIN.PASSWORD')}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className='login-error'>{t(`ERRORS.${error}`)}</p>}

      <button className='login-button' type='submit'>
        {t('common:FORMS.LOGIN.SUBMIT')}
      </button>
    </form>
  );
};

export default LoginForm;