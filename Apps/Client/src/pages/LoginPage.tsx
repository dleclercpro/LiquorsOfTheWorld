import React from 'react';
import './LoginPage.scss';
import LoginForm from '../components/forms/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className='login-page'>
      <div className='login-box'>
        <h1 className='login-title'>Liquors of the World</h1>
        <p className='login-text'>Welcome to tonight's quiz!</p>
        <p className='login-text'>Get ready to showcase your mastery of the world's spirits in an epic quiz, where only the savviest liquor aficionados will manage to claim victory...</p>
        <p className='login-text'>Are you ready?</p>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;