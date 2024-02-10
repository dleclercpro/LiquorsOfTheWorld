import React from 'react';
import './ScoresPage.scss';
import HamburgerMenu from '../components/HamburgerMenu';
import Scoreboard from '../components/Scoreboard';

const ScoresPage: React.FC = () => {
  return (
    <React.Fragment>
      <HamburgerMenu />
      <Scoreboard />
    </React.Fragment>
  );
};

export default ScoresPage;