import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import { CallLogin } from '../calls/auth/CallLogin';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await new CallLogin(username, password).execute();

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
        <p className='login-text'>Welcome to tonight's quiz! Are you ready?</p>
        
        <form className='login-form' onSubmit={(e) => handleSubmit(e)}>
          <input
            className='login-username'
            type='text'
            value={username}
            placeholder='Username?'
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className='login-password'
            type='password'
            value={password}
            placeholder='Password?'
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