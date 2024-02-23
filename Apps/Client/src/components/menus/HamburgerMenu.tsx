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
import { useTranslation } from 'react-i18next';

const HamburgerMenu: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const quiz = useSelector((state) => state.quiz);
  const status = useSelector((state) => state.quiz.status.data);
  const user = useSelector((state) => state.user);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const handleClickOnMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    toggleMenu();
  }

  if (quiz.id === null || status === null || user === null) {
    return null;
  }

  const username = user.username as string;
  const hasStarted = status.hasStarted;

  const Icon = isOpen ? CloseIcon : OpenIcon;

  return (
    <div className='hamburger-menu'>
      <div className='hamburger-menu-icon-container' onClick={handleClickOnMenu}>
        <Icon className='hamburger-menu-icon' />
      </div>
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
                {t('COMMON.QUIZ')}
                <QuizIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
          {location.pathname !== '/scores' && hasStarted && (
            <li>
              <Link to={`/scores`}>
                {t('COMMON.SCOREBOARD')}
                <ScoreboardIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
          <li>
          </li>
          <li>
            <Link to='/' onClick={() => dispatch(logout())}>
              {t('COMMON.LOG_OUT')}
              <LogoutIcon className='hamburger-menu-link-icon' />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HamburgerMenu;