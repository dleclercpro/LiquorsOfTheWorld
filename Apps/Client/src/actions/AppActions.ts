import { VersionData } from '../types/DataTypes';
import { CallGetVersion } from '../calls/quiz/CallGetVersion';
import { setVersion, setBackgroundUrl } from '../reducers/AppReducer';
import { ThunkAPI, createServerAction } from './ServerActions';
import { CallDeleteDatabase } from '../calls/quiz/CallDeleteDatabase';
import { logoutAction } from './UserActions';
import { SERVER_ROOT } from '../config';
import { CallGetBackgroundUrl } from '../calls/data/CallGetBackgroundUrl';
import { RootState } from '../stores/store';

export const updateVersionAction = createServerAction<void, void>(
  'app/update-version',
  async (_, { dispatch }: ThunkAPI) => {
    const { data } = await new CallGetVersion().execute();

    const { version } = data as VersionData;

    dispatch(setVersion(version));
  },
);

export const updateBackgroundAction = createServerAction<void, void>(
  'app/update-background',
  async (_, { getState, dispatch }: ThunkAPI) => {
    const { quiz } = getState() as RootState;

    if (quiz.name === null) {
      throw new Error('MISSING_QUIZ_NAME');
    }

    const { data: path } = await new CallGetBackgroundUrl(quiz.name).execute()

    const url = `${SERVER_ROOT}${path}`;

    dispatch(setBackgroundUrl(url));
  },
);

export const deleteDatabaseAction = createServerAction<void, void>(
  'app/delete-database',
  async (_, { dispatch }: ThunkAPI) => {
    await new CallDeleteDatabase().execute();

    dispatch(logoutAction());
  },
);