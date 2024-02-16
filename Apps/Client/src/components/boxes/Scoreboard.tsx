import './Scoreboard.scss';
import { useState, useEffect } from 'react';
import { CallGetScores } from '../../calls/quiz/CallGetScores';

interface Props {
  quizId: string,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { quizId } = props;
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (quizId === undefined) {
      return;
    }
    
    const fetchScores = async () => {
      const { data } = await new CallGetScores(quizId).execute();

      return data;
    }

    fetchScores().then((scores) => {
      setScoreboard(scores ?? scoreboard);
    });
  }, [quizId]);
  
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
          {Object.entries(scoreboard).map(([username, score], i) => {
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