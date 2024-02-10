import React, { useState } from 'react';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would add your logic to check if the username is already in use
    console.log(username);
  };

  return (
    <div className='page'>
      <div className='box'>
        <h1 className='title'>Liquors of the World</h1>
        <p className='text'>Welcome to tonight's quiz! Are you ready?</p>
        
        <form className='form' onSubmit={handleSubmit}>
          <input
            type='text'
            value={username}
            placeholder='What is your name?'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type='submit'>Let's go!</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;