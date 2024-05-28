import { useSelector } from './useRedux';

const useData = () => {
  const data = useSelector(({ data }) => data);

  return {
    quizzes: data.quizzes,
  };
};

export default useData;