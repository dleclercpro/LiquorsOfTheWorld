import { useTranslation } from 'react-i18next';
import { ScoresData } from '../types/DataTypes';
import './Scoreboard.scss';
import useUser from '../hooks/useUser';
import { ScoreComparator } from '../utils/scores';

interface Props {
  title?: string,
  scores: ScoresData,
  hasMissingPoints?: boolean,
}

const Scoreboard: React.FC<Props> = ({ title, scores, hasMissingPoints }) => {
  const { t } = useTranslation();

  const user = useUser();

  const pointColumnsCount = hasMissingPoints ? 3 : 2;

  // Sort users in descending order according to score value
  const sortedScores = Object.entries(scores).map(([username, score]) => ({ username, score }));
  sortedScores.sort((a, b) => ScoreComparator.compare(a, b, 'DESC'));

  return (
    <div className='scoreboard'>
      {title && (
        <p className='scores-title'>
          <strong>{title}</strong>
        </p>
      )}
      <table className={`scoreboard-table col-${pointColumnsCount}`}>
        <thead>
          <tr>
              <th rowSpan={2}>{t('common:COMMON.RANK')}</th>
              <th rowSpan={2}>{t('common:COMMON.USERNAME')}</th>
              <th colSpan={pointColumnsCount}>{t('common:COMMON.POINTS')}</th>
          </tr>
          <tr>
              <th>{t('PAGES.SCOREBOARD.RIGHT_POINTS')}</th>
              <th>{t('PAGES.SCOREBOARD.WRONG_POINTS')}</th>
              {hasMissingPoints && (
                <th>{t('PAGES.SCOREBOARD.MISSED_POINTS')}</th>
              )}
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(({ username, score }, i) => {
            return (
              <tr key={`scoreboard-table-row-${i}`} className={username === user.username ? 'is-self' : ''}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{username}</strong>
                  </td>
                  <td colSpan={pointColumnsCount} className='scoreboard-inner-table-container'>
                    <table className='scoreboard-inner-table'>
                      <tbody>
                        <tr>
                          <td>{score.right}</td>
                          <td>{score.wrong}</td>
                          {hasMissingPoints && (
                            <td>{score.missed}</td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;