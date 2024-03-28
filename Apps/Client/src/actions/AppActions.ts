import { VersionData } from '../types/DataTypes';
import { CallGetVersion } from '../calls/quiz/CallGetVersion';
import { setVersion, setBackgroundUrl } from '../reducers/AppReducer';
import { ThunkAPI, createServerAction } from './ServerActions';
import { CallDeleteDatabase } from '../calls/quiz/CallDeleteDatabase';
import { logout } from './AuthActions';
import { SERVER_ROOT } from '../config';
import { CallGetBackgroundUrl } from '../calls/data/CallGetBackgroundUrl';

export const updateVersion = createServerAction<void, void>(
  'app/update-version',
  async (_, { dispatch }: ThunkAPI) => {
    const { data } = await new CallGetVersion().execute();

    const { version } = data as VersionData;

    dispatch(setVersion(version));
  },
);

export const updateBackground = createServerAction<void, void>(
  'app/update-background',
  async (_, { getState, dispatch }: ThunkAPI) => {
    const { quiz } = getState();

    if (!quiz.name) {
      throw new Error('Cannot update background if quiz name is undefined!');
    }

    const { data: path } = await new CallGetBackgroundUrl(quiz.name).execute()

    const url = `${SERVER_ROOT}${path}`;

    dispatch(setBackgroundUrl(url));
  },
);

export const deleteDatabase = createServerAction<void, void>(
  'app/delete-database',
  async (_, { dispatch }: ThunkAPI) => {
    await new CallDeleteDatabase().execute();

    dispatch(logout());
  },
);