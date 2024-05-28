import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import { DEBUG } from './config';
import AdminPage from './pages/AdminPage';
import AuthRoute from './routes/AuthRoute';
import LoadingOverlay from './components/overlays/LoadingOverlay';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect } from 'react';
import { useDispatch, useSelector } from './hooks/useRedux';
import { ping } from './actions/AuthActions';
import Nav from './components/Nav';
import ErrorPage from './pages/ErrorPage';
import { updateBackground, updateVersion } from './actions/AppActions';
import { fetchQuizNames } from './actions/DataActions';

function App() {
  const dispatch = useDispatch();

  const app = useSelector((state) => state.app);
  const quiz = useSelector((state) => state.quiz);
  const isAdmin = useSelector(({ user }) => user.isAdmin);

  useEffect(() => {
    dispatch(ping());
    dispatch(updateVersion());
    dispatch(fetchQuizNames());
  }, []);

  useEffect(() => {
    if (quiz.name === null) {
      return;
    }

    dispatch(updateBackground());

  }, [quiz.name]);
  
  return (
    <div className='app' style={{ backgroundImage: `url(${app.styles.bg})` }}>
      <div className='app-container'>
        <Nav />

        <Routes>
          {(DEBUG || isAdmin) && (
            <Route path='/admin' element={(
              <AdminPage />
            )} />
          )}

          <Route path='/quiz' element={(
            <AuthRoute>
              <QuizPage />
            </AuthRoute>
          )} />
          <Route path='/scores' element={(
            <AuthRoute>
              <ScoresPage />
            </AuthRoute>
          )} />
          <Route path='/error' element={(
            <ErrorPage />
          )} />
          <Route path='/' element={(
            <HomePage />
          )} />

          {/* Error route */}
          <Route path='*' element={(
            <Navigate to='/error' />
          )} />
        </Routes>
        
        <LoadingOverlay />
        <AnswerOverlay />
      </div>
    </div>
  );
}

export default App;