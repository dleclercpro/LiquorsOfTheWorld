import React from 'react'; // Do not remove!
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <div className='app'>
      <div className='app-container'>
        <Router>
            <Routes>
              <Route path='/quiz/:questionId' element={<QuizPage />} />
              <Route path='/' element={<LoginPage />} />
            </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;