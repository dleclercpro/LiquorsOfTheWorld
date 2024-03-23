import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../hooks/redux';

type Props = {
  children: ReactNode,
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const quiz = useSelector((state) => state.quiz);

  if (!isAuthenticated) {
    return <Navigate to={quiz.name ? `/?q=${quiz.name}` : `/`} />;
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthRoute;