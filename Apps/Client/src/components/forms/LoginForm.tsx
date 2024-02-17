import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../hooks/redux';
import { selectAuthentication } from '../../reducers/UserReducer';
import './LoginForm.scss';
import { login } from '../../actions/UserActions';

const LoginForm: React.FC = () => {
  const [quizId, setQuizId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const auth = useSelector(selectAuthentication);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to current quiz question on successful login
  useEffect(() => {
    if (auth.status === 'succeeded') {
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

    await dispatch(login({ quizId, username, password }));
  };

  return (
    <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
        <input
        id='login-quiz-id'
        type='text'
        value={quizId}
        placeholder='Enter a quiz ID'
        onChange={(e) => setQuizId(e.target.value)}
        required
      />

      <input
        id='login-username'
        type='text'
        value={username}
        placeholder='Enter a username'
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        id='login-password'
        type='password'
        value={password}
        placeholder='Enter a password'
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className='login-error'>{error}</p>}

      <button className='login-button' type='submit'>
        Let's go!
      </button>
    </form>
  );
};

export default LoginForm;