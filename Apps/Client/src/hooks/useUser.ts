import { logout as doLogout } from '../actions/AuthActions';
import { useDispatch, useSelector } from './ReduxHooks';

const useUser = () => {
  const auth = useSelector(({ auth }) => auth);

  const dispatch = useDispatch();

  const logout = async () => {
    return await dispatch(doLogout());
  }

  return {
    username: auth.username,
    isAdmin: auth.isAdmin,
    isAuthenticated: auth.isAuthenticated,
    logout,
  };
};

export default useUser;