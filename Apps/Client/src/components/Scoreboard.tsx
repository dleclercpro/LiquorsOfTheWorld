import { useTranslation } from 'react-i18next';
import { useSelector } from '../hooks/redux';
import { ScoreData } from '../types/DataTypes';
import { toSortedArr } from '../utils/array';
import './Scoreboard.scss';

interface Props {
  scores: ScoreData,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { scores } = props;

  const { t } = useTranslation();

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
      <h2 className='scoreboard-title'>{t('common:COMMON.SCOREBOARD')}</h2>
      <p className='scoreboard-sub-title'>
        {t('common:COMMON.QUIZ')}:
        <strong className='scoreboard-quiz-label'>
          {quizId}
        </strong>
      </p>
      <p className='scoreboard-text'>
        {t(isOver ? 'PAGES.SCOREBOARD.STATUS_OVER' : 'PAGES.SCOREBOARD.STATUS_NOT_OVER', { questionsCount: questions.length, questionsAnsweredCount: questionIndex })}
      </p>
      <table className='scoreboard-table'>
        <thead>
          <tr>
              <th>{t('common:COMMON.RANK')}</th>
              <th>{t('common:COMMON.USERNAME')}</th>
              <th>{t('common:COMMON.SCORE')}</th>
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