import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { logoutAction } from '../actions/AuthActions';

export enum OverlayName {
  Loading = 'loading',
  Answer = 'answer',
}

type OverlayState = {
  open: boolean,
};

type OverlaysState = Record<OverlayName, OverlayState>;

const initialState: OverlaysState = {
  [OverlayName.Loading]: {
    open: false,
  },
  [OverlayName.Answer]: {
    open: false,
  },
};



export const overlaysSlice = createSlice({
  name: 'overlays',
  initialState,
  reducers: {
    openOverlay: (state, action: PayloadAction<OverlayName>) => {
      state[action.payload].open = true;
    },
    closeOverlay: (state, action: PayloadAction<OverlayName>) => {
      state[action.payload].open = false;
    },
    closeAllOverlays: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Reset state on logout, no matter if successful or not
      .addCase(logoutAction.fulfilled, () => initialState)
      .addCase(logoutAction.rejected, () => initialState);
    },
});

export const { openOverlay, closeOverlay, closeAllOverlays } = overlaysSlice.actions;

export default overlaysSlice.reducer;