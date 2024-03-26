import React from 'react';
import './AdminPage.scss';
import { useDispatch, useSelector } from '../hooks/redux';
import { closeAllOverlays } from '../reducers/OverlaysReducer';
import Page from './Page';
import { deleteDatabase } from '../actions/AppActions';
import { Navigate } from 'react-router-dom';
import { deleteCookie, deleteFromLocalStorage } from '../utils/cookie';
import { Snackbar, SnackbarContent, SnackbarOrigin } from '@mui/material';
import Fade from '@mui/material/Fade';

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

  const quiz = useSelector((state) => state.quiz);

  dispatch(closeAllOverlays());

  const handleCloseSnackbar = () => {
    setState({ ...state, open: false });
  };

  const handleDeleteCookie: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (quiz.name) {
      deleteCookie(quiz.name);

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
      deleteFromLocalStorage(quiz.name);

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
  }

  if (!quiz.name) {
    return (
      <Navigate to='/error' />
    );
  }

  return (
    <Page title='Admin' className='admin-page'>
      <div className='admin-page-box'>
        <h1 className='admin-page-title'>Administration</h1>
        <p className='admin-page-text'>Here are your options:</p>
        <button className='admin-page-button' onClick={handleDeleteCookie}>
          Delete cookie
        </button>
        <button className='admin-page-button' onClick={handleDeleteLocalStorage}>
          Delete local storage
        </button>
        <button className='admin-page-button' onClick={handleDeleteDatabase}>
          Delete database
        </button>
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