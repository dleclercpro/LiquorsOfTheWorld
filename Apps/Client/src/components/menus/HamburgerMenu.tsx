import React, { useState } from 'react';
import './HamburgerMenu.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../actions/UserActions';
import OpenIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import QuizIcon from '@mui/icons-material/Quiz';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

const HamburgerMenu: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const quiz = useSelector((state) => state.quiz);
  const user = useSelector((state) => state.user);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const handleClickOnMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    toggleMenu();
  }

  if (quiz.id === null || user === null) {
    return null;
  }

  const username = user.username as string;

  const Icon = isOpen ? CloseIcon : OpenIcon;

  return (
    <div className='hamburger-menu' onClick={handleClickOnMenu}>
      <Icon className='hamburger-menu-icon' />
      <div className={`hamburger-menu-content ${isOpen ? 'visible' : 'hidden'}`}>
        <ul>
          <li>
            <p>
              <strong className='hamburger-menu-username'>{username}</strong>
            </p>
          </li>
          {location.pathname !== '/quiz' && (
            <li>
              <Link to={`/quiz`}>
                Quiz
                <QuizIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
          {location.pathname !== '/scores' && (
            <li>
              <Link to={`/scores`}>
                Scoreboard
                <ScoreboardIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
          <li>
          </li>
          <li>
            <Link to='/' onClick={() => dispatch(logout())}>
              Log out
              <LogoutIcon className='hamburger-menu-link-icon' />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HamburgerMenu;