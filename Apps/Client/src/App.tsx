import React from 'react'; // Do not remove!
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import ScoresPage from './pages/ScoresPage';

function App() {
  return (
    <div className='app'>
      <div className='app-container'>
        <Router>
            <Routes>
              <Route path='/quiz/:questionId' element={<QuizPage />} />
              <Route path='/scores' element={<ScoresPage />} />
              <Route path='/' element={<LoginPage />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;