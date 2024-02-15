import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect } from 'react';
import { DEBUG } from './config';
import TestPage from './pages/TestPage';
import { useDispatch } from './hooks/redux';
import { fetchQuizData } from './reducers/QuizReducer';

function App() {  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchQuizData());
  }, []);

  return (
    <Router>
        <div className='app'>
          <div className='app-container'>
            <Routes>
              {DEBUG && (
                <Route path='/test' element={<TestPage />} />
              )}
              <Route path='/quiz' element={<QuizPage />} />
              <Route path='/scores' element={<ScoresPage />} />
              <Route path='/' element={<LoginPage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
          <AnswerOverlay />
        </div>
    </Router>
  );
}

export default App;