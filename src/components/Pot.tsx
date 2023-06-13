/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import JeuPodiumABI from '../utils/JeuPodiumABI.json';
import { useContractRead } from 'wagmi';
import { ResponseKitty } from '../interfaces/ResponseKitty';
import { ethers } from 'ethers';
import { isMobile } from 'react-device-detect';
import useGame from '../stores/useGame';

const Pot: React.FC = () => {
  const [pot, setPot] = useState<number>(0);
  const setPotState = useGame((state) => state.setPot);

  const jackpotState = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADRESS,
    abi: JeuPodiumABI,
    functionName: 'getJackpot',
    watch: true,
  }) as ResponseKitty;

  useEffect(() => {
    if (jackpotState.isSuccess) {
      setPot(Number(ethers.utils.formatEther(jackpotState.data)) * 0.7);
      setPotState(Number(ethers.utils.formatEther(jackpotState.data)) * 0.7);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jackpotState.isLoading]);

  return (
    <div className="card money--wrapper">
      <div className="money ">
        <img src="/images/money.png" alt="money" />
        <div className="flash-primary bold">
          <span className="flash-success">{pot.toFixed(4)}ETH</span>{' '}
          {isMobile ? '' : 'TO WIN'}
        </div>
      </div>
    </div>
  );
};

export default Pot;
