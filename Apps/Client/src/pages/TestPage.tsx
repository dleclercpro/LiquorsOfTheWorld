import React from 'react';
import './TestPage.scss';
import NavMenu from '../components/menus/NavMenu';

const TestPage: React.FC = () => {
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