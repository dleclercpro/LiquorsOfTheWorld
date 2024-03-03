import React from 'react';
import './Page.scss';

type Props = {
  children: React.ReactNode,
  className: string,
}

const Page: React.FC<Props> = (props) => {
  const { children, className } = props;

  return (
    <div className={`page ${className}`}>
      {children}
    </div>
  );
};

export default Page;