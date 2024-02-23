import React from 'react';
import './TestPage.scss';
import NavMenu from '../components/Nav';
import { useDispatch } from '../hooks/redux';
import { hideAllOverlays } from '../reducers/OverlaysReducer';

const TestPage: React.FC = () => {
  const dispatch = useDispatch();

  dispatch(hideAllOverlays());

  return (
    <div className='test-page'>
      <NavMenu />

      <div className='test-page-box'>
        <h1 className='test-page-title'>Test page</h1>
        <p className='test-page-text'>This is the test page.</p>
      </div>
    </div>
  );
};

export default TestPage;