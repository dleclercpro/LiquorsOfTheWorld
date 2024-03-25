import { RootState } from '../stores/store';

export const selectAuthentication = (state: RootState) => state.user;