import { CallLogIn } from '../calls/auth/CallLogIn';
import { CallPingResponseData, LoginData, PingData, AuthData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { createServerAction } from './ServerActions';
import { authSlice } from '../reducers/AuthReducer';

export const login = createServerAction<LoginData, void>(
  'auth/login',
  async (args: LoginData, { dispatch }) => {
    console.log(`Executing action: 'auth/login'`);

    const { data } = await new CallLogIn().execute(args);

    const auth = data as AuthData;

    dispatch(authSlice.actions.setAuth({
      username: auth.username,
      isAdmin: auth.isAdmin,
      isAuthenticated: true,
    }));
  },
);

export const logout = createServerAction<void, void>(
  'auth/logout',
  async (_, { dispatch }) => {
    console.log(`Executing action: 'auth/logout'`);

    dispatch(authSlice.actions.setAuth({
      username: null,
      isAdmin: false,
      isAuthenticated: false,
    }));

    await new CallLogOut().execute();
  },
);

export const ping = createServerAction<void, CallPingResponseData>(
  'auth/ping',
  async () => {
    console.log(`Executing action: 'auth/ping'`);

    const { data } = await new CallPing().execute();

    return data as PingData;
  },
);