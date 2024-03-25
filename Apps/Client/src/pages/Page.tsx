import React, { useEffect } from 'react';
import './Page.scss';
import { useSelector } from '../hooks/redux';

type Props = {
  children: React.ReactNode,
  className: string,
  title: string,
}

const Page: React.FC<Props> = (props) => {
  const { children, className, title } = props;

  const app = useSelector((state) => state.app);

  // Set page title
  useEffect(() => {
    document.title = title;
  }, [title]);

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