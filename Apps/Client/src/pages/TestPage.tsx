import React from 'react';
import './TestPage.scss';
import ButtonWithText from '../components/boxes/ButtonWithText';
import { incremented } from '../reducers/CounterReducer';
import { incrementAsync } from '../reducers/CounterAsyncReducer';
import { RootState } from '../store';
import { useDispatch, useSelector } from '../hooks/redux';

const TestPage: React.FC = () => {
  const counter = useSelector((state: RootState) => state.counter);
  const counterAsync = useSelector((state: RootState) => state.counterAsync);
  const dispatch = useDispatch();

  return (
    <div className='test-page'>
      <ButtonWithText primary text={`Count: ${counter.value}`} onClick={() => dispatch(incremented())}>
        Increment
      </ButtonWithText>

      <ButtonWithText text={`Count async: ${counterAsync.value}`} onClick={() => dispatch(incrementAsync(1))}>
        {counterAsync.status === 'loading' ? 'Incrementing...' : 'Increment async'}
      </ButtonWithText>
    </div>
  );
};

export default TestPage;