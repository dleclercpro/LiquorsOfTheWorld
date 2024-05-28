import { deleteDatabase as doDeleteDatabase } from '../actions/AppActions';
import { useDispatch } from './useRedux';

const useDatabase = () => {
  const dispatch = useDispatch();

  const deleteDatabase = async () => {
    await dispatch(doDeleteDatabase());
  }

  return {
    delete: deleteDatabase,
  };
};

export default useDatabase;