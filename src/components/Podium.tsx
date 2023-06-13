/* eslint-disable react/no-unknown-property */
import React, { useEffect } from 'react';
import JeuPodiumABI from '../utils/JeuPodiumABI.json';
import { useContractRead } from 'wagmi';
import { ResponsePodium } from '../interfaces/ResponsePodium';
import useGame from '../stores/useGame';
import { ResponseKitty } from '../interfaces/ResponseKitty';
import { Player } from '../interfaces/Player';
import { ethers } from 'ethers';

function getRewardByLeaderboard(leaderboard: number, kitty: number): number {
  const kittyMinusCreatorFees = Number(ethers.utils.formatEther(kitty)) * 0.7;

  switch (leaderboard) {
    case 1:
      return kittyMinusCreatorFees * 0.5;
    case 2:
      return kittyMinusCreatorFees * 0.3;
    case 3:
      return kittyMinusCreatorFees * 0.2;
    default:
      return kittyMinusCreatorFees * 0.2;
  }
}

function getClassNameByPosition(position: number): string {
  switch (position) {
    case 1:
      return 'first-position';
    case 2:
      return 'second-position';
    case 3:
      return 'third-position';

    default:
      return 'not-ranked';
  }
}

const Podium: React.FC = () => {
  const leaderboard: Player[] = useGame((state) => state.leaderboard);
  const setLeaderboard = useGame((state) => state.setLeaderboard);

  const { data, isSuccess } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADRESS,
    abi: JeuPodiumABI,
    functionName: 'getPodiumInfo',
    watch: true,
  }) as ResponsePodium;

  const jackpotState = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADRESS,
    abi: JeuPodiumABI,
    functionName: 'getJackpot',
    watch: true,
  }) as ResponseKitty;

  useEffect(() => {
    if (data && isSuccess && jackpotState.isSuccess) {
      setLeaderboard(
        data.addresses.map((value, index) => {
          return {
            address: value,
            score: Number(data.scores[index]),
            reward: +getRewardByLeaderboard(
              index + 1,
              jackpotState.data
            ).toFixed(4),
          };
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, jackpotState.isSuccess]);

  return (
    <div className="podium">
      {leaderboard.map((player, index) => (
        <span
          key={index}
          className={
            player.address === '0x0000000000000000000000000000000000000000'
              ? 'no-player rank'
              : 'rank'
          }
        >
          {player.address !== '0x0000000000000000000000000000000000000000' ? (
            <span>
              <span className={getClassNameByPosition(index + 1)}>
                {index + 1})
              </span>{' '}
              {player.address.slice(0, 5)}...
              {player.address.slice(
                player.address.length - 3,
                player.address.length
              )}{' '}
              :{' '}
            </span>
          ) : (
            <span>
              <span className={getClassNameByPosition(index + 1)}>
                {index + 1})
              </span>{' '}
              No player -{' '}
            </span>
          )}
          <span className="bold">{player.score}</span> pts -{' '}
          <span className="flash-success">{player.reward}</span> ETH
        </span>
      ))}
    </div>
  );
};

export default Podium;
