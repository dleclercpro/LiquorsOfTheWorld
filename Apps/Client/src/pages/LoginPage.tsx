import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import { CallAddPlayer } from '../calls/auth/CallAddPlayer';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const res = await new CallAddPlayer(user).execute();
      console.warn(`Here:`);
      console.warn(res);

      navigate(`/quiz`);

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
            value={user}
            placeholder='Username?'
            onChange={(e) => setUser(e.target.value)}
            required
          />

          <input
            className='login-password'
            type='password'
            value={user}
            placeholder='Password?'
            onChange={(e) => setUser(e.target.value)}
            required
          />

          {error && <p className='login-error'>{error}</p>}

          <button className='login-button' type='submit'>Let's go!</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;