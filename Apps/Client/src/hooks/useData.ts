import { useSelector } from './ReduxHooks';

const useData = () => {
  // Note: no new instances will be created, since the props are directly derived
  // from the root state
  const data = useSelector(({ data }) => data);

  return {
    quizzes: data.quizzes,
  };
};

export default useData;