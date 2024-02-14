import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.scss';
import { CallLogIn } from '../../calls/auth/CallLogIn';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await new CallLogIn(username, password).execute();

      // Go to last question answered in the quiz
      navigate(`/quiz`);

    } catch (err: any) {
      const { message } = err;

      setError(message);
    }
  };

  return (
    <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
      <input
        className='login-username'
        type='text'
        value={username}
        placeholder='Enter a username'
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        className='login-password'
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