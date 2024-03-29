import { CallLogIn } from '../calls/auth/CallLogIn';
import { LoginData, PingData, UserData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { createServerAction } from './ServerActions';

export const login = createServerAction<LoginData, UserData>(
  'auth/login',
  async (args: LoginData) => {
    const { quizId } = args;
    const { data } = await new CallLogIn().execute(args);

    if (!data) {
      throw new Error('MISSING_DATA');
    }
    
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

export const ping = createServerAction<void, PingData>(
  'auth/ping',
  async () => {
    const { data } = await new CallPing().execute();

    if (!data) {
      throw new Error('MISSING_DATA');
    }

    return data as PingData;
  },
);