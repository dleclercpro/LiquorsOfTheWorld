import React, { useEffect, useRef, useState } from 'react';
import './HamburgerMenu.scss';
import { useDispatch, useSelector } from '../../hooks/redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../actions/UserActions';
import OpenIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import QuizIcon from '@mui/icons-material/Quiz';
import LanguageIcon from '@mui/icons-material/Translate';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { useTranslation } from 'react-i18next';

const HamburgerMenu: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = i18n;

  const [lang, setLang] = useState(language);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const status = useSelector((state) => state.quiz.status.data);
  const user = useSelector((state) => state.user);

  // Change language in i18n when it is changed in the component's state
  useEffect(() => {
    changeLanguage(lang);
  }, [lang]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Add event listener when the menu is open
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      // Clean up the event listener when the component unmounts or when the menu is closed
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const toggleLanguage = () => {
    if (lang === 'en') {
      setLang('de');
    } else {
      setLang('en');
    }
  }

  const handleClickOnMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    toggleMenu();
  }

  const handleLanguageSwitch = () => {
    toggleLanguage();
  }

  const username = user.username;
  const isAuthenticated = username !== null;
  const hasStarted = status?.hasStarted;

  const Icon = isOpen ? CloseIcon : OpenIcon;

  return (
    <div className='hamburger-menu' ref={menuRef}>
      <div className='hamburger-menu-icon-container' onClick={handleClickOnMenu}>
        <Icon className='hamburger-menu-icon' />
      </div>
      <nav className={`hamburger-menu-content ${isOpen ? 'visible' : 'hidden'}`}>
        <ul>
          {isAuthenticated && (
            <li>
              <p>
                <strong className='hamburger-menu-username'>{username}</strong>
              </p>
            </li>
          )}
          {location.pathname !== '/quiz' && isAuthenticated && (
            <li>
              <Link to={`/quiz`}>
                {t('COMMON.QUIZ')}
                <QuizIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
          {location.pathname !== '/scores' && isAuthenticated && hasStarted && (
            <li>
              <Link to={`/scores`}>
                {t('COMMON.SCOREBOARD')}
                <ScoreboardIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
          <li>
            <button onClick={handleLanguageSwitch}>
              {language === 'en' ? t('COMMON.GERMAN') : t('COMMON.ENGLISH')}
              <LanguageIcon className='hamburger-menu-link-icon' />
            </button>
          </li>
          {isAuthenticated && (
            <li>
              <Link to='/' onClick={() => dispatch(logout())}>
                {t('COMMON.LOG_OUT')}
                <LogoutIcon className='hamburger-menu-link-icon' />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default HamburgerMenu;