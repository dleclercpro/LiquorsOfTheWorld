import './Scoreboard.scss';
import { ScoreboardData } from '../../types/DataTypes';

interface Props {
  scores: ScoreboardData,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { scores } = props;
  
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
          {Object.entries(scores).map(([username, score], i) => {
            return (
              <tr key={`scoreboard-row-${i}`}>
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