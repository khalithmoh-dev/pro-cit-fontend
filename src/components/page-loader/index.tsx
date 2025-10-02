import React from 'react';
import Spinner from '../spinner';

const PageLoader = () => {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  );
};

export default PageLoader;
