import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import { CallLogIn } from '../calls/auth/CallLogIn';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await new CallLogIn(username, password).execute();

      navigate(`/quiz/0`);

    } catch (err: any) {
      const { message } = err;

      setError(message);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-box'>
        <h1 className='login-title'>Liquors of the World</h1>
        <p className='login-text'>Welcome to tonight's quiz!</p>
        <p className='login-text'>Get ready to showcase your mastery of the world's spirits in an epic quiz, where only the savviest liquor aficionados will manage to claim victory...</p>
        <p className='login-text'>Are you ready?</p>
        
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
      </div>
    </div>
  );
};

export default LoginPage;