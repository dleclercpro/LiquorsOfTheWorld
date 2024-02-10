import './Scoreboard.scss';
import { QuizScoreboard } from '../types/QuizTypes';
import { useState, useEffect } from 'react';
import { CallGetScores } from '../calls/data/CallGetScores';

const Scoreboard = () => {
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const getScores = async () => {
      const { data } = await new CallGetScores().execute();

      return data;
    }

    getScores().then((scores) => {
      setScoreboard(scores ?? scoreboard);
    });
  }, []);
  
  return (
    <div className='scoreboard'>
      <h2 className='scoreboard-title'>Scoreboard</h2>
      <table className='scoreboard-table'>
        <tr>
            <th>Username</th>
            <th>Score</th>
        </tr>
        {Object.entries(scoreboard).map(([username, score]) => {
          return (
            <tr>
                <td>{username}</td>
                <td>{score}</td>
            </tr>
          );
        })}
    </table>

    </div>
  );
};

export default Scoreboard;