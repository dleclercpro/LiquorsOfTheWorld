import React from 'react';
import './TestPage.scss';
import Counter from '../components/boxes/Counter';

const TestPage: React.FC = () => {
  return (
    <div className='test-page'>
      <Counter />
    </div>
  );
};

export default TestPage;