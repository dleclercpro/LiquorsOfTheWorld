import { FetchedData } from '../types/DataTypes';

export const getInitialFetchedData = <Data> (): FetchedData<Data> => ({
  data: null,
  status: 'idle',
  error: null,
});