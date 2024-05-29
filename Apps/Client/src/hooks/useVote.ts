import { selectVote } from '../selectors/QuizSelectors';
import { useSelector } from './ReduxHooks';

const useVote = (questionIndex: number) => {
  const vote = useSelector((state) => selectVote(state, questionIndex));

  return vote;
};

export default useVote;