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
  const questions = quiz.questions.data;
  const status = quiz.status.data;

  if (questions === null || status === null) {
    return null;
  }

  const { isOver } = status;
  
  return (
    <div className='scoreboard'>
      <h2 className='scoreboard-title'>Scoreboard</h2>
      <p className='scoreboard-subtitle'>
        <strong>
          {`Quiz: ${quizId}`}
        </strong>
      </p>
      <p className='scoreboard-text'>
        {`Here are the ${isOver ? 'final' : 'current'} results of this quiz:`}
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
                  <td>{score}/{questions.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;