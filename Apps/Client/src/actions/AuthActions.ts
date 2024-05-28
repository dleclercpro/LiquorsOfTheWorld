import { CallLogIn } from '../calls/auth/CallLogIn';
import { CallLogInResponseData, CallPingResponseData, LoginData, PingData, UserData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { createServerAction } from './ServerActions';

export const login = createServerAction<LoginData, CallLogInResponseData>(
  'auth/login',
  async (args: LoginData) => {
    const { quizId } = args;
    const { data } = await new CallLogIn().execute(args);

    const user = data as UserData;

    return {
      username: user.username,
      isAdmin: user.isAdmin,
      quizId,
    };
  },
);

export const logout = createServerAction<void, void>(
  'auth/logout',
  async () => {
    await new CallLogOut().execute();
  },
);

export const ping = createServerAction<void, CallPingResponseData>(
  'auth/ping',
  async () => {
    const { data } = await new CallPing().execute();

    return data as PingData;
  },
);