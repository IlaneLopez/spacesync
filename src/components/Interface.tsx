/* eslint-disable react/no-unknown-property */
import React, { useEffect } from 'react';
import useGame from '../stores/useGame';
import { GameStatus } from '../interfaces/GameStatus';
import { motion } from 'framer-motion';
import Web3 from './Web3';
import Footer from './Footer';
import { isBrowser, isMobile } from 'react-device-detect';
import GameControls from './GameControls';
import { useAccount } from 'wagmi';
import ConnectWalletButton from './ConnectWalletButton';
import Pot from './Pot';

const Interface: React.FC = () => {
  const score = useGame((state) => state.score);
  const status = useGame((state) => state.status);
  const home = useGame((state) => state.home);
  const { address, isConnected } = useAccount();
  const connectWallet = useGame((state) => state.connect);

  useEffect(() => {
    if (isConnected && address) {
      connectWallet();
    }
  }, [isConnected, address, connectWallet]);

  return (
    <>
      <div className="interface">
        <div className="header">
          <button
            className="brand"
            disabled={status !== GameStatus.Ended}
            onClick={() => home()}
          >
            <img src="/images/logo.png" alt="logo" />
            <div>SPACE SYNC</div>
          </button>
          <div className="right-header-section">
            {status !== GameStatus.Playing && (
              <>
                <Pot />
                <ConnectWalletButton />
              </>
            )}
          </div>
          {status === GameStatus.Playing && (
            <div className="score">
              <div>
                <div>Score</div>
                <div>{score}</div>
              </div>
            </div>
          )}
        </div>

        <Web3 />
        {status === GameStatus.Playing && (
          <>
            <motion.div
              className="instructions"
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 6, times: [0, 0.1, 0.8, 1] }}
            >
              <div>
                Use the left and right arrows on your keyboard to move the ship
              </div>
              {isBrowser && (
                <div className="arrows-keys">
                  <span className="arrow">{'<'}</span>
                  <span className="arrow">{'>'}</span>
                </div>
              )}
            </motion.div>
            {isMobile && <GameControls />}
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Interface;
