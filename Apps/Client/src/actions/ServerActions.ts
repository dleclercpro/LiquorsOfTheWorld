import { createAsyncThunk } from '@reduxjs/toolkit';
import { DEBUG } from '../config';

export type ThunkAPI = {
  dispatch: Function, 
  getState: Function, 
  rejectWithValue: Function
};

export const createServerAction = <ActionArgs, ActionResult> (name: string, action: (args: ActionArgs, thunkAPI: ThunkAPI) => Promise<ActionResult>) => createAsyncThunk(
  name,
  async (args: ActionArgs, thunkAPI: ThunkAPI) => {
    try {
      if (DEBUG) {
        console.log(`Executing server action '${name}'...`);
      }

      return await action(args, thunkAPI);

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not execute server action '${name}': ${error}`);
      return thunkAPI.rejectWithValue(error);
    }
  }
);