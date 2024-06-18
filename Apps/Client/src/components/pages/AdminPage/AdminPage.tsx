import React, { useEffect } from 'react';
import './AdminPage.scss';
import { useDispatch } from '../../../hooks/ReduxHooks';
import { closeAllOverlays } from '../../../reducers/OverlaysReducer';
import Page from '../Page';
import { Navigate, useNavigate } from 'react-router-dom';
import { deleteCookie, getCookie } from '../../../utils/storage';
import { Snackbar, SnackbarContent, SnackbarOrigin } from '@mui/material';
import Fade from '@mui/material/Fade';
import { COOKIE_NAME, DEBUG, URL_PARAM_QUIZ_NAME } from '../../../config';
import { useTranslation } from 'react-i18next';
import useQuiz from '../../../hooks/useQuiz';
import useUser from '../../../hooks/useUser';
import useDatabase from '../../../hooks/useDatabase';
import { PageUrl } from '../../../constants';
import PersistedStore from '../../../stores/AppState';

interface SnackbarState extends SnackbarOrigin {
  open: boolean,
  message: string,
}

const AdminPage: React.FC = () => {
  const [state, setState] = React.useState<SnackbarState>({
    open: false,
    message: '',
    vertical: 'bottom',
    horizontal: 'left',
  });

  const { open, message, vertical, horizontal } = state;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const quiz = useQuiz();
  const user = useUser();
  const database = useDatabase();

  const hasCookie = Boolean(getCookie(COOKIE_NAME));
  const hasLocalStorage = Boolean(PersistedStore.getStore());
  const hasNoOptions = !DEBUG && !user.isAdmin && !hasCookie && !hasLocalStorage;



  // Close all overlays when opening admin page
  useEffect(() => {
    dispatch(closeAllOverlays());

  }, []);



  const handleCloseSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleDeleteCookie: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name !== null) {
      deleteCookie(COOKIE_NAME);

      await user.logout();

      setState({
        ...state,
        open: true,
        message: 'Deleted cookie.',
      });

      navigate(PageUrl.Home);
    }
  }

  const handleDeleteLocalStorage: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name !== null) {
      alert(`This might break the app's UI!`);

      // Delete app state storage
      PersistedStore.reset();

      setState({
        ...state,
        open: true,
        message: 'Deleted local storage.',
      });

      navigate(`${PageUrl.Home}?${URL_PARAM_QUIZ_NAME}=${quiz.name}`);
    }
  }

  const handleDeleteDatabase: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    await database.delete();

    setState({
      ...state,
        open: true,
        message: 'Deleted database.',
    });

    navigate(PageUrl.Home);
  }

  if (quiz.name === null) {
    return (
      <Navigate to={PageUrl.Error} />
    );
  }

  return (
    <Page title={t('common:COMMON.ADMIN')} className='admin-page'>
      <div className='admin-page-box'>
        <h1 className='admin-page-title'>{t('common:COMMON.ADMIN')}</h1>
        {hasNoOptions && (
          <p className='admin-page-text'>{t('common:PAGES.ADMIN.NOTHING_TO_DO')}</p>
        )}

        {hasCookie && (
          <button className='admin-page-button' onClick={handleDeleteCookie}>
            {t('common:PAGES.ADMIN.DELETE_COOKIE')}
          </button>
        )}
        {hasLocalStorage && (DEBUG || user.isAdmin) && (
          <button className='admin-page-button' onClick={handleDeleteLocalStorage}>
            {t('common:PAGES.ADMIN.DELETE_LOCAL_STORAGE')}
          </button>
        )}
        {(DEBUG || user.isAdmin) && (
          <button className='admin-page-button' onClick={handleDeleteDatabase}>
          {t('common:PAGES.ADMIN.DELETE_DATABASE')}
          </button>
        )}
      </div>

      <Snackbar
        className='admin-page-snackbar'
        color='primary'
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={1200}
        TransitionComponent={Fade}
        onClose={handleCloseSnackbar}
        key={vertical + horizontal}
      >
        <SnackbarContent
          className='admin-page-snackbar-content'
          message={message}
        />
      </Snackbar>
    </Page>
  );
};

export default AdminPage;