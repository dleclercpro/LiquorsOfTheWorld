import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import { CallAddPlayer } from '../calls/auth/CallAddPlayer';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await new CallAddPlayer(user).execute();

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
            className='login-input'
            type='text'
            value={user}
            placeholder='What shall be your username?'
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