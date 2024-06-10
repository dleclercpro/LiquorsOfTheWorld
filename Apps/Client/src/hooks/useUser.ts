import { useEffect, useState } from 'react';
import { logoutAction as doLogout } from '../actions/UserActions';
import { useDispatch, useSelector } from './ReduxHooks';

const useUser = () => {
  // Note: no new instances will be created, since the props are directly derived
  // from the root state
  const user = useSelector(({ user }) => user);

  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const logout = async () => {
    return await dispatch(doLogout());
  }

  // Store authentication error
  useEffect(() => {
    if (user.status === 'failed' && user.error) {
      setError(user.error);
    }
  }, [user.status, user.error]);

  return {
    error,
    username: user.username,
    teamId: user.teamId,
    isAdmin: user.isAdmin,
    isAuthenticated: user.isAuthenticated,
    logout,
  };
};

export default useUser;