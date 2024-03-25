import { VersionData } from '../types/DataTypes';
import { CallGetVersion } from '../calls/quiz/CallGetVersion';
import { setVersion } from '../reducers/AppReducer';
import { ThunkAPI, createServerAction } from './ServerActions';

export const updateVersion = createServerAction<void, void>(
  'app/updateVersion',
  async (_, { dispatch }: ThunkAPI) => {
    const { data } = await new CallGetVersion().execute();

    if (!data) {
      throw new Error('MISSING_DATA');
    }

    const { version } = data as VersionData;

    dispatch(setVersion(version));
  },
);