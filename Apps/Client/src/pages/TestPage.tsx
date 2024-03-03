import React from 'react';
import './TestPage.scss';
import { useDispatch } from '../hooks/redux';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';

const TestPage: React.FC = () => {
  const dispatch = useDispatch();

  dispatch(closeAllOverlays());

  return (
    <Page className='test-page'>
      <div className='test-page-box'>
        <h1 className='test-page-title'>Test page</h1>
        <p className='test-page-text'>This is the test page.</p>
      </div>
    </Page>
  );
};

export default TestPage;