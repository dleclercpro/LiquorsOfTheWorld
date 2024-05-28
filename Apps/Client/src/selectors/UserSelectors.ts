import { RootState } from '../stores/store';

export const selectUser = (state: RootState) => state.user;