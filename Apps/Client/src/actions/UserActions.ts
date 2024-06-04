import { CallLogIn } from '../calls/auth/CallLogIn';
import { CallPingResponseData, PingData, UserData, CallLogInRequestData } from '../types/DataTypes';
import { CallPing } from '../calls/auth/CallPing';
import { CallLogOut } from '../calls/auth/CallLogOut';
import { createServerAction } from './ServerActions';
import { userSlice } from '../reducers/UserReducer';
import { setQuizId } from '../reducers/QuizReducer';

export const loginAction = createServerAction<CallLogInRequestData, void>(
  'auth/login',
  async (args, { dispatch }) => {
    const { data } = await new CallLogIn().execute(args);

    const { username, team, isAdmin, isAuthenticated } = data as UserData;

    dispatch(setQuizId(args.quizId));
    
    dispatch(userSlice.actions.setAuth({
      username,
      team,
      isAdmin,
      isAuthenticated,
    }));
  },
);

export const logoutAction = createServerAction<void, void>(
  'auth/logout',
  async (_, { dispatch }) => {
    dispatch(userSlice.actions.setAuth({
      username: null,
      team: null,
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