import React, { useEffect, useState } from 'react';
import './ErrorPage.scss';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Page from './Page';
import { sleep } from '../utils/time';
import { getRange } from '../utils/array';

const WAIT_SECONDS = 10;



const ErrorPage: React.FC = () => {
  const [remainingTime, setRemainingTime] = useState(0);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const wait = async (seconds: number = 0) => {
    const range = getRange(seconds, 'DESC').map(x => x + 1);
    
    for (const t of range) {
      setRemainingTime(t);

      await sleep(1_000);
    }
  };

  // Redirect user to the home page after a given time
  useEffect(() => {
    wait(WAIT_SECONDS)
      .finally(() => {
        navigate('/');
      });

  }, []);

  return (
    <Page className='error-page'>
        <div className='error-page-box'>
          <h1 className='error-page-title'>{t('PAGES.ERROR.TITLE')}</h1>
          <p className='error-page-text'>{t('PAGES.ERROR.TEXT')}</p>
          <p className='error-page-text'>
            {remainingTime === 1 ? (
              <Trans i18nKey='PAGES.ERROR.REDIRECTING_SINGLE' values={{ remainingTime }}>
                ... <strong>...</strong> ...
              </Trans>
            ) : (
              <Trans i18nKey='PAGES.ERROR.REDIRECTING_MANY' values={{ remainingTime }}>
                ... <strong>...</strong> ...
              </Trans>
            )}
          </p>
        </div>
    </Page>
  );
};

export default ErrorPage;