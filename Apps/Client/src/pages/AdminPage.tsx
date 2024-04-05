import React from 'react';
import './AdminPage.scss';
import { useDispatch, useSelector } from '../hooks/redux';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';
import { deleteDatabase } from '../actions/AppActions';
import { Navigate, useNavigate } from 'react-router-dom';
import { deleteCookie, deleteFromLocalStorage, getCookie, getFromLocalStorage } from '../utils/storage';
import { Snackbar, SnackbarContent, SnackbarOrigin } from '@mui/material';
import Fade from '@mui/material/Fade';
import { COOKIE_NAME } from '../config';
import { useTranslation } from 'react-i18next';
import { logout } from '../actions/AuthActions';

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

  const quiz = useSelector((state) => state.quiz);
  // const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAdmin = useSelector(({ user }) => user.isAdmin);
  const hasCookie = Boolean(getCookie(COOKIE_NAME));
  const hasLocalStorage = Boolean(getFromLocalStorage('persist:root'));

  let hasNoOptions = true;

  if (isAdmin) {
    hasNoOptions = !hasCookie && !hasLocalStorage;
  } else {
    hasNoOptions = !hasCookie;
  }

  dispatch(closeAllOverlays());

  const handleCloseSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleDeleteCookie: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name) {
      deleteCookie(COOKIE_NAME);

      dispatch(logout());

      setState({
        ...state,
        open: true,
        message: 'Deleted cookie.',
      });

      navigate('/');
    }
  }

  const handleDeleteLocalStorage: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name) {
      alert(`This might break the app's UI!`);

      deleteFromLocalStorage('persist:root'); // Delete Redux Persist storage

      setState({
        ...state,
        open: true,
        message: 'Deleted local storage.',
      });

      navigate(`/?q=${quiz.name}`);
    }
  }

  const handleDeleteDatabase: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    await dispatch(deleteDatabase());

    setState({
      ...state,
        open: true,
        message: 'Deleted database.',
    });

    navigate('/');
  }

  if (!quiz.name) {
    return (
      <Navigate to='/error' />
    );
  }

  console.log(`hasCookie: ${hasCookie}, hasLocalStorage: ${hasLocalStorage}, isAdmin: ${isAdmin}`);

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
        {hasLocalStorage && isAdmin && (
          <button className='admin-page-button' onClick={handleDeleteLocalStorage}>
            {t('common:PAGES.ADMIN.DELETE_LOCAL_STORAGE')}
          </button>
        )}
        {isAdmin && (
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