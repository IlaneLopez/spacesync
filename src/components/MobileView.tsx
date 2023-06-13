import React from 'react';

const MobileView: React.FC = () => {
  return (
    <div className="black-screen">
      <div className="brand">
        <img width="50" height="50" src="/images/logo.png" alt="logo" />
        <div>SPACE SYNC</div>
      </div>
      <div className="message">Our game is not yet available on mobile!</div>
    </div>
  );
};

export default MobileView;
