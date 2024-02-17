import React, { useEffect } from 'react';
import './LoginPage.scss';
import LoginForm from '../components/forms/LoginForm';
import { useSelector } from '../hooks/redux';
import { useNavigate, useParams } from 'react-router';

const LoginPage: React.FC = () => {
  const { quizId } = useParams();
  
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    navigate(`/quiz`);

  }, [isAuthenticated]);

  return (
    <div className='login-page'>
      <div className='login-box'>
        <h1 className='login-title'>Liquors of the World</h1>
        <p className='login-text'>Welcome to tonight's quiz!</p>
        <p className='login-text'>Get ready to showcase your mastery of the world's spirits in an epic quiz, where only the savviest liquor aficionados will manage to claim victory...</p>
        <p className='login-text'>Are you ready?</p>
        
        <LoginForm quizId={quizId} />
      </div>
    </div>
  );
};

export default LoginPage;