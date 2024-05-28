import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';

type Props = {
  children: ReactNode,
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const user = useUser();

  if (!user.isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthRoute;