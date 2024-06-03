import { CallLogIn } from '../calls/auth/CallLogIn';
import { CallPingResponseData, LoginData, PingData, AuthData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { createServerAction } from './ServerActions';
import { authSlice } from '../reducers/AuthReducer';

export const loginAction = createServerAction<LoginData, string>(
  'auth/login',
  async (args: LoginData, { dispatch }) => {
    const { data } = await new CallLogIn().execute(args);

    const auth = data as AuthData;

    dispatch(authSlice.actions.setAuth({
      username: auth.username,
      isAdmin: auth.isAdmin,
      isAuthenticated: true,
    }));

    return args.quizId;
  },
);

export const logoutAction = createServerAction<void, void>(
  'auth/logout',
  async (_, { dispatch }) => {
    dispatch(authSlice.actions.setAuth({
      username: null,
      isAdmin: false,
      isAuthenticated: false,
    }));

    await new CallLogOut().execute();
  },
);

export const pingAction = createServerAction<void, CallPingResponseData>(
  'auth/ping',
  async () => {
    const { data } = await new CallPing().execute();

    return data as PingData;
  },
);