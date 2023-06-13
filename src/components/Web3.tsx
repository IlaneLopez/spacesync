/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import useGame from '../stores/useGame';
import { useAccount } from 'wagmi';
import UserScore from './UserScore';
import Start from './Start';
import { GameStatus } from '../interfaces/GameStatus';
import Modal from './Modal';
import Podium from './Podium';
import Tutorial from './Tutorial';
import Restart from './Restart';

const Web3: React.FC = () => {
  const status = useGame((state) => state.status);
  const [leaderboardIsOpen, setLeaderboardIsOpen] = useState<boolean>(false);
  const [tutorialIsOpen, setTutorialIsOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  return (
    <>
      <div className="middle">
        {(status === GameStatus.NotConnected ||
          status === GameStatus.Ready) && (
          <div className="menu--wrapper">
            <ul className="menu">
              <Start />
              <li className="menu--item">
                <div className="dot"></div>
                <button onClick={() => setLeaderboardIsOpen(true)}>
                  LEADERBOARD
                </button>
              </li>
              <li className="menu--item">
                <div className="dot"></div>
                <button onClick={() => setTutorialIsOpen(true)}>
                  HOW IT WORKS
                </button>
              </li>
            </ul>
          </div>
        )}
        {status === GameStatus.Ended && <Restart />}

        {address &&
          isConnected &&
          (status === GameStatus.Ended || status === GameStatus.Ready) && (
            <>
              <UserScore address={address} />
            </>
          )}
      </div>
      {leaderboardIsOpen && (
        <Modal title="LEADERBOARD" onclose={() => setLeaderboardIsOpen(false)}>
          <Podium />
        </Modal>
      )}
      {tutorialIsOpen && (
        <Modal title="HOW IT WORKS" onclose={() => setTutorialIsOpen(false)}>
          <Tutorial />
        </Modal>
      )}
    </>
  );
};

export default Web3;
