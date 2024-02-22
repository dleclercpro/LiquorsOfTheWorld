import { useSelector } from '../hooks/redux';
import { ScoreData } from '../types/DataTypes';
import { toSortedArr } from '../utils/array';
import './Scoreboard.scss';

interface Props {
  scores: ScoreData,
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

  const { isOver, questionIndex } = status;

  const sortedScores = toSortedArr(scores, 'DESC')
    .map(({ key, value }) => ({ username: key, score: value }));
  
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
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(({ username, score }, i) => {
            return (
              <tr key={`scoreboard-table-row-${i}`}>
                  <td>{i + 1}</td>
                  <td>{username}</td>
                  <td>{score}/{questionIndex}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;