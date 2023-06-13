/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import JeuPodiumABI from '../utils/JeuPodiumABI.json';
import { useAccount, useContractRead } from 'wagmi';
import { Player } from '../interfaces/Player';
import { ResponseUserScore } from '../interfaces/ResponseUserScore';
import useGame from '../stores/useGame';

interface UserScoreProps {
  address: string;
}

const UserScore: React.FC<UserScoreProps> = (props) => {
  const { data, isLoading, refetch } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADRESS,
    abi: JeuPodiumABI,
    functionName: 'getPlayerScore',
    args: [props.address],
    watch: true,
    onSuccess(newScore) {
      setUserBestScore(Number(newScore));
    },
  }) as ResponseUserScore;
  const [connectedPlayer, setConnectedPlayer] = useState<Player | null>(null);
  const scoreIsSubmited: boolean = useGame((state) => state.isScoreSubmited);
  const setUserBestScore = useGame((state) => state.setUserBestScore);
  const userBestScore = useGame((state) => state.userBestScore);
  const { address } = useAccount();

  useEffect(() => {
    if (data) {
      setConnectedPlayer({
        score: Number(data),
        address: props.address,
        reward: 0,
      });
      setUserBestScore(Number(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (address) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoreIsSubmited, address]);

  return (
    <>
      {connectedPlayer && !isLoading && (
        <div>Your best score: {userBestScore} pts</div>
      )}
    </>
  );
};

export default UserScore;
