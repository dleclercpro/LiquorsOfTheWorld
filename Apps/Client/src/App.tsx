import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { DEBUG } from './config';
import TestPage from './pages/TestPage';
import AuthRoute from './routes/AuthRoute';

function App() {  
  return (
    <Router>
      <div className='app'>
        <div className='app-container'>
          <Routes>
            {DEBUG && (
              <Route path='/test' element={<TestPage />} />
            )}
            <Route path='/quiz/:quizId' element={(
              <AuthRoute>
                <QuizPage />
              </AuthRoute>
              )} />
            <Route path='/quiz/:quizId/scores' element={(
              <AuthRoute>
                <ScoresPage />
              </AuthRoute>
            )} />
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