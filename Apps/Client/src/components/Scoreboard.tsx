import { useTranslation } from 'react-i18next';
import { ScoresData } from '../types/DataTypes';
import './Scoreboard.scss';

interface Props {
  title?: string,
  scores: ScoresData,
  hasMissingPoints?: boolean,
}

const Scoreboard: React.FC<Props> = ({ title, scores, hasMissingPoints }) => {
  const { t } = useTranslation();

  const pointColumnsCount = hasMissingPoints ? 3 : 2;

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
          {Object.entries(scores).map(([username, score], i) => {
            return (
              <tr key={`scoreboard-table-row-${i}`}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{username}</strong>
                  </td>
                  <td colSpan={pointColumnsCount}>
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