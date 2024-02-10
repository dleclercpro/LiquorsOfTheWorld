import React, { useEffect } from 'react';
import './ScoresPage.scss';
import { CallGetScores } from '../calls/data/CallGetScores';

const ScoresPage: React.FC = () => {
  useEffect(() => {
    new CallGetScores().execute();
  }, []);

  return (
    <div className='scores-page'>

    </div>
  );
};

export default ScoresPage;