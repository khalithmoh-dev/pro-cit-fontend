import React from 'react';
import Spinner from '../spinner';

const PageLoader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Spinner />
    </div>
  );
};

export default PageLoader;
