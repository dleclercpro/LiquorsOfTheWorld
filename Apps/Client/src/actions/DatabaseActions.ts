import { logout } from './AuthActions';
import { CallDeleteDatabase } from '../calls/quiz/CallDeleteDatabase';
import { ThunkAPI, createServerAction } from './ServerActions';

export const deleteDatabase = createServerAction<void, void>(
  'database/delete',
  async (_, { dispatch }: ThunkAPI) => {
    await new CallDeleteDatabase().execute();

    dispatch(logout());
  },
);