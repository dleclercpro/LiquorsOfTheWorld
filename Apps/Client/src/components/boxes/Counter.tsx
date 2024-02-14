import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { incremented } from '../../reducers/counter.slice';
import './Counter.scss';

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div id='counter'>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(incremented())}>Increment</button>
    </div>
  );
};

export default Counter;