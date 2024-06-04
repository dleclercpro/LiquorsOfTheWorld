import { useTranslation } from 'react-i18next';
import { ScoresData } from '../types/DataTypes';
import { toSortedArray } from '../utils/array';
import './Scoreboard.scss';
import useQuiz from '../hooks/useQuiz';

interface Props {
  scores: ScoresData,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { scores } = props;

  const { t } = useTranslation();

  const quiz = useQuiz();

  if (!quiz.questions || !quiz.status) {
    return null;
  }

  // FIXME: scores of all players in real-time
  const questionsCount = quiz.questions.length;
  // const questionsAnsweredCount = quiz.votes.filter((vote) => vote !== NO_VOTE_INDEX).length;
  const questionsAnsweredCount = quiz.isOver ? questionsCount : quiz.questionIndex;

  const sortedScores = toSortedArray(scores, 'DESC')
    .map(({ key, value }) => ({ username: key, score: value }));

  return (
    <div className='scoreboard'>
      <h2 className='scoreboard-title'>{t('common:COMMON.SCOREBOARD')}</h2>
      <p className='scoreboard-sub-title'>
        {t('common:COMMON.QUIZ')}:
        <strong className='scoreboard-quiz-label'>
          {quiz.id}
        </strong>
      </p>
      <p className='scoreboard-text'>
        {t(quiz.isOver ? 'PAGES.SCOREBOARD.STATUS_OVER' : 'PAGES.SCOREBOARD.STATUS_NOT_OVER', { questionsCount, questionsAnsweredCount })}
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
                  <td>
                    <strong>{username}</strong>
                  </td>
                  <td>{score}/{questionsAnsweredCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;