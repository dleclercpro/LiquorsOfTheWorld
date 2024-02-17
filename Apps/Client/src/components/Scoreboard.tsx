import { useSelector } from '../hooks/redux';
import { ScoresData } from '../types/DataTypes';
import './Scoreboard.scss';

interface Props {
  scores: ScoresData,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { scores } = props;

  const quiz = useSelector((state) => state.quiz);
  const quizId = quiz.id;
  
  return (
    <div className='scoreboard'>
      <h2 className='scoreboard-title'>Scoreboard</h2>
      <p className='scoreboard-subtitle'>
        <strong>
          {`Quiz #${quizId}`}
        </strong>
      </p>
      <p className='scoreboard-text'>
        Here are the results of this quiz:
      </p>
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
              <tr key={`scoreboard-table-row-${i}`}>
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