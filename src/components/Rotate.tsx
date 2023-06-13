import React from 'react';

const Rotate: React.FC = () => {
  return (
    <div className="black-screen">
      <div className="brand">
        <img width="50" height="50" src="/images/logo.png" alt="logo" />
        <div>SPACE SYNC</div>
      </div>
      <div className="phone"></div>
      <div className="message">Please rotate your device!</div>
    </div>
  );
};

export default Rotate;
