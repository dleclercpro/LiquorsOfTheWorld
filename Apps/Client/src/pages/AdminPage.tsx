import React from 'react';
import './AdminPage.scss';
import { useDispatch, useSelector } from '../hooks/redux';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';
import { deleteDatabase } from '../actions/AppActions';
import { Navigate, useNavigate } from 'react-router-dom';
import { deleteCookie, deleteFromLocalStorage } from '../utils/cookie';
import { Snackbar, SnackbarContent, SnackbarOrigin } from '@mui/material';
import Fade from '@mui/material/Fade';
import { COOKIE_NAME } from '../config';
import { useTranslation } from 'react-i18next';

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
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAdmin = useSelector(({ user }) => user.isAdmin);

  dispatch(closeAllOverlays());

  const handleCloseSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleDeleteCookie: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name) {
      deleteCookie(COOKIE_NAME);

      setState({
        ...state,
        open: true,
        message: 'Deleted cookie.',
      });
    }
  }

  const handleDeleteLocalStorage: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name) {
      deleteFromLocalStorage('persist:root'); // Delete Redux Persist storage

      setState({
        ...state,
        open: true,
        message: 'Deleted local storage.',
      });
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

  return (
    <Page title='Admin' className='admin-page'>
      <div className='admin-page-box'>
        <h1 className='admin-page-title'>{t('common:COMMON.ADMIN')}</h1>
        <p className='admin-page-text'>Here are your options:</p>
        <button className='admin-page-button' onClick={handleDeleteCookie}>
          Delete cookie
        </button>
        <button className='admin-page-button' onClick={handleDeleteLocalStorage}>
          Delete local storage
        </button>
        {isAuthenticated && isAdmin && (
          <button className='admin-page-button' onClick={handleDeleteDatabase}>
            Delete database
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