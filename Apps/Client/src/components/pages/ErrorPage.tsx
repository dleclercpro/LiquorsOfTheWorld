import React from 'react';
import './ErrorPage.scss';
import { useTranslation } from 'react-i18next';
import Page from './Page';

const ErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('common:COMMON:ERROR')} className='error-page'>
        <div className='error-page-box'>
          <h1 className='error-page-title'>{t('common:PAGES.ERROR.TITLE')}</h1>
          <p className='error-page-text'>{t('common:PAGES.ERROR.TEXT')}</p>
        </div>
    </Page>
  );
};

export default ErrorPage;