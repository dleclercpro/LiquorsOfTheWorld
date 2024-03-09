import React from 'react';
import './Page.scss';
import { useSelector } from '../hooks/redux';

type Props = {
  children: React.ReactNode,
  className: string,
}

const Page: React.FC<Props> = (props) => {
  const { children, className } = props;

  const app = useSelector((state) => state.app);

  return (
    <div className={`page ${className}`}>
      {children}

      {app.version !== null && (
        <p className='app-version'>{app.version}</p>
      )}
    </div>
  );
};

export default Page;