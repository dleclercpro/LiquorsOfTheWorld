import React, { useState } from 'react';
import './HamburgerMenu.scss';
import { useDispatch } from '../../hooks/redux';
import { logout } from '../../reducers/AuthReducer';

type HamburgerMenuProps = {

}

const HamburgerMenu: React.FC<HamburgerMenuProps> = (props) => {
  const [menuClass, setMenuClass] = useState('hamburger-menu-content hidden');

  const dispatch = useDispatch();
  
  const showMenu = () => {
    setMenuClass(menuClass.replace('hidden', 'visible'));
  }

  const hideMenu = () => {
    setMenuClass(menuClass.replace('visible', 'hidden'));
  }

  const toggleMenu = () => {
    if (menuClass.includes('hidden')) {
      showMenu();
    } else {
      hideMenu();
    }
  }

  const handleClickOnMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    toggleMenu();
  }

  return (
    <div className='hamburger-menu' onClick={handleClickOnMenu}>
      <div className='hamburger-menu-icon'>
        &#9776;
      </div>
      <div className={menuClass}>
        <a href='/' onClick={() => dispatch(logout())}>Log out</a>
      </div>
    </div>
  );
}

export default HamburgerMenu;