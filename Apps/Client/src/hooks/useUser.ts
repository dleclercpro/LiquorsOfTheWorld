import { logout as doLogout } from '../actions/AuthActions';
import { useDispatch, useSelector } from './useRedux';

const useUser = () => {
  const user = useSelector(({ user }) => user);

  const dispatch = useDispatch();

  const logout = async () => {
    return await dispatch(doLogout());
  }

  return {
    username: user.username,
    isAdmin: user.isAdmin,
    isAuthenticated: user.isAuthenticated,
    logout,
  };
};

export default useUser;