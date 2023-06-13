/* eslint-disable react/no-unknown-property */
import React from 'react';
import useGame from '../stores/useGame';

const Footer: React.FC = () => {
  const setLowFPSMode = useGame((state) => state.setLowFPSMode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLowFPSMode(e.target.checked);
  };

  return (
    <div className="footer--wrapper">
      <div className="fps-mode">
        <div className="checkbox-wrapper-8">
          <input
            className="tgl tgl-skewed"
            name="cb3-8"
            id="cb3-8"
            type="checkbox"
            onChange={handleChange}
          />
          <label
            htmlFor="cb3-8"
            className="tgl-btn"
            data-tg-off="OFF"
            data-tg-on="ON"
          >
            {' '}
          </label>
        </div>
        <span>Low FPS mode</span>
      </div>
      <div className="footer">
        <a
          target="_blank"
          href="mailto:spacesync.project@gmail.com?subject=I found a bug"
          rel="noreferrer"
        >
          spacesync.project@gmail.com
        </a>
        <a
          target="_blank"
          href="https://twitter.com/SpaceSync_"
          rel="noreferrer"
        >
          @SpaceSync_
        </a>
      </div>
    </div>
  );
};

export default Footer;
