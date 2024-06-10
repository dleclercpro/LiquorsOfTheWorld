import { useTranslation } from 'react-i18next';
import { GroupedScoresData } from '../types/DataTypes';
import './Scoreboard.scss';
import useQuiz from '../hooks/useQuiz';
import useUser from '../hooks/useUser';
import { UserType } from '../constants';
import { ScoreComparator } from '../utils/scores';

interface Props {
  scores: GroupedScoresData,
  ignoreAdmins?: boolean,
}

const Scoreboard: React.FC<Props> = ({ scores, ignoreAdmins = true }) => {
  const { t } = useTranslation();

  const quiz = useQuiz();
  const user = useUser();

  if (quiz.questions === null || quiz.status === null) {
    return null;
  }

  const questionsCount = quiz.questions.length;
  const publishedAnswersCount = quiz.isOver ? questionsCount : quiz.questionIndex + 1;

  const regularUserScores = Object.entries(scores[UserType.Regular]);
  const adminUserScores = Object.entries(scores[UserType.Admin]);
  
  // Sort users in descending order according to score value
  const sortedScores = {
    [UserType.Regular]: regularUserScores.map(([username, score]) => ({ username, score })),
    [UserType.Admin]: adminUserScores.map(([username, score]) => ({ username, score })),
  };
  sortedScores[UserType.Regular].sort(ScoreComparator.compare);
  sortedScores[UserType.Admin].sort(ScoreComparator.compare);

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

      <div className='scoreboard-table-container'>
        {!ignoreAdmins && (
          <p className='scoreboard-table-title'>
            <strong>Regulars</strong>
          </p>
        )}
        <table className='scoreboard-table'>
          <thead>
            <tr>
                <th>{t('common:COMMON.RANK')}</th>
                <th>{t('common:COMMON.USERNAME')}</th>
                <th>{t('common:COMMON.SCORE')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores[UserType.Regular].map(({ username, score }, i) => {
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

      {!ignoreAdmins && (
        <div className='scoreboard-table-container'>
          <p className='scoreboard-table-title'>
            <strong>Admins</strong>
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
              {sortedScores[UserType.Admin].map(({ username, score }, i) => {
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
      )}
    </div>
  );
};

export default Scoreboard;