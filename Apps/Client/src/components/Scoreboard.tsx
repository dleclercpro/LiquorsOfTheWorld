import { useTranslation } from 'react-i18next';
import { GroupedScoresData } from '../types/DataTypes';
import './Scoreboard.scss';
import useQuiz from '../hooks/useQuiz';
import useUser from '../hooks/useUser';

interface Props {
  scores: GroupedScoresData,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { scores } = props;

  const { t } = useTranslation();

  const quiz = useQuiz();
  const user = useUser();

  if (quiz.questions === null || quiz.status === null) {
    return null;
  }

  const questionsCount = quiz.questions.length;
  const publishedAnswersCount = quiz.isOver ? questionsCount : quiz.questionIndex + 1;

  // FIXME: only consider regular users
  // Sort users in descending order according to score value
  const sortedScores = Object.entries(scores.users)
    .map(([username, score]) => ({ username, score }));

  sortedScores.sort((a, b) => {
    if (a.score.value < b.score.value) return 1;
    if (a.score.value > b.score.value) return -1;
    return 0;
  });

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
        {t(quiz.isOver ? 'PAGES.SCOREBOARD.STATUS_OVER' : 'PAGES.SCOREBOARD.STATUS_NOT_OVER', { questionsCount, publishedAnswersCount })}
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
                  {user.isAdmin ? (
                    <td>{score.value}/{score.total}</td>
                  ) : (
                    <td>{score.value}</td>
                  )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;