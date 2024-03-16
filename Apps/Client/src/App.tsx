import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import { BACKGROUND_URLS, DEBUG } from './config';
import TestPage from './pages/TestPage';
import AuthRoute from './routes/AuthRoute';
import LoadingOverlay from './components/overlays/LoadingOverlay';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect, useState } from 'react';
import { useDispatch } from './hooks/redux';
import { ping } from './actions/UserActions';
import { getRandom } from './utils/array';
import Nav from './components/Nav';
import ErrorPage from './pages/ErrorPage';
import { fetchVersion } from './actions/AppActions';

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState('');

  const dispatch = useDispatch();

  // Check if user is logged in already
  useEffect(() => {
    setBackgroundUrl(`url(${getRandom(BACKGROUND_URLS)})`);

    dispatch(ping());

    dispatch(fetchVersion());
  }, []);

  return (
    <div className='app' style={{ backgroundImage: backgroundUrl }}>
      <div className='app-container'>
        <Nav />

        <Routes>
          {/* Debugging routes */}
          {DEBUG && (
            <>
              <Route path='/test' element={(
                <TestPage />
              )} />
            </>
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