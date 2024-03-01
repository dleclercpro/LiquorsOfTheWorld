import React from 'react';
import './TestPage.scss';
import Nav from '../components/Nav';
import { useDispatch } from '../hooks/redux';
import { closeAllOverlays } from '../reducers/OverlaysReducer';

const TestPage: React.FC = () => {
  const dispatch = useDispatch();

  dispatch(closeAllOverlays());

  return (
    <div className='test-page'>
      <Nav />

      <div className='test-page-box'>
        <h1 className='test-page-title'>Test page</h1>
        <p className='test-page-text'>This is the test page.</p>
      </div>
    </div>
  );
};

export default TestPage;