import React, { useEffect } from 'react';
import './Page.scss';
import useApp from '../hooks/useApp';

type Props = {
  children: React.ReactNode,
  className: string,
  title: string,
}

const Page: React.FC<Props> = (props) => {
  const { children, className, title } = props;

  const app = useApp();

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