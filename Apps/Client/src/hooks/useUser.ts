import { useSelector } from './useRedux';

const useUser = () => {
  const user = useSelector(({ user }) => user);

  return {
    username: user.username,
    isAdmin: user.isAdmin,
    isAuthenticated: user.isAuthenticated,
  };
};

export default useUser;