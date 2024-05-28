import { useSelector } from './ReduxHooks';

const useData = () => {
  const data = useSelector(({ data }) => data);

  return {
    quizzes: data.quizzes,
  };
};

export default useData;