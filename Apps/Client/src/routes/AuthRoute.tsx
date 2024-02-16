import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../hooks/redux';

type Props = {
  children: ReactNode,
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;