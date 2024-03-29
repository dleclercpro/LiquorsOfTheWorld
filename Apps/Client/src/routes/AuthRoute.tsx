import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../hooks/redux';

type Props = {
  children: ReactNode,
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthRoute;