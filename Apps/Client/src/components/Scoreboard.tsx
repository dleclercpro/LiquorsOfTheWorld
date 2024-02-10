import './Scoreboard.scss';
import { useState, useEffect } from 'react';
import { CallGetScores } from '../calls/data/CallGetScores';

const Scoreboard: React.FC = () => {
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await new CallGetScores().execute();

      return data;
    }

    fetchScores().then((scores) => {
      setScoreboard(scores ?? scoreboard);
    });
  }, [scoreboard, setScoreboard]);
  
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