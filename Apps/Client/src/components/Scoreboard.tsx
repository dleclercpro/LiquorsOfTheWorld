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
  }, []);
  
  return (
    <div className='scoreboard'>
      <h2 className='scoreboard-title'>Scoreboard</h2>
      <table className='scoreboard-table'>
        <thead>
          <tr>
              <th>Username</th>
              <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scoreboard).map(([username, score], index) => {
            return (
              <tr key={`scoreboard-row-${index}`}>
                  <td>{username}</td>
                  <td>{score}</td>
              </tr>
            );
          })}
        </tbody>
    </table>
    </div>
  );
};

export default Scoreboard;