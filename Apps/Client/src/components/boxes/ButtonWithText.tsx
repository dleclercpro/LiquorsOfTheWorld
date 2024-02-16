import React from 'react';
import './ButtonWithText.scss';

type Props = {
  children: React.ReactNode,
  text: string,
  primary?: boolean,
  secondary?: boolean,
  onClick: () => {},
}

const ButtonWithText: React.FC<Props> = (props) => {
  const { children, text, primary, secondary, onClick } = props;

  return (
    <div className={`button-with-text ${primary ? 'primary' : ''} ${secondary ? 'secondary' : ''}`}>
      <p>{text}</p>
      <button onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default ButtonWithText;