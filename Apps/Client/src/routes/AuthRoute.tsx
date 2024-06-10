import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { PageUrl } from '../constants';

type Props = {
  children: ReactNode,
}

const AuthRoute: React.FC<Props> = ({ children }) => {
  const user = useUser();

  if (!user.isAuthenticated) {
    return <Navigate to={PageUrl.Home} />;
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthRoute;