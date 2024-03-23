import { SERVER_ROOT } from '../config';
import { QuizName } from '../constants';
import { FetchedData } from '../types/DataTypes';

export const getInitialFetchedData = <Data> (): FetchedData<Data> => ({
  data: null,
  status: 'idle',
  error: null,
});

export const getBackgroundUrls = (quizName: QuizName) => {
  return (process.env.REACT_APP_BG_IMAGES as string)
    .split(',')
    .map(filename => `${SERVER_ROOT}/static/img/bg/${quizName}/${filename}`);
};