/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import JeuPodiumABI from '../utils/JeuPodiumABI.json';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import useGame from '../stores/useGame';
import { GameStatus } from '../interfaces/GameStatus';
import SubmitScore from './SubmitScore';
import Modal from './Modal';
import ConnectWalletButton from './ConnectWalletButton';
import { ethers } from 'ethers';

const Restart: React.FC = () => {
  const [error, setError] = useState<string | undefined>();

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADRESS,
    abi: JeuPodiumABI,
    functionName: 'payFee',
    args: [{ value: ethers.utils.parseEther('0.001') }],
    onError(err: any) {
      if (err?.data?.message) {
        setError(err?.data?.message);
      } else {
        setError(err.message);
      }
    },
    onSuccess() {
      setError(undefined);
    },
  });
  const { write, data, isLoading } = useContractWrite(config);
  const waitForTransaction = useWaitForTransaction({
    hash: data?.hash,
    onError(err: any) {
      if (err?.data?.message) {
        setError(err?.data?.message);
      } else {
        setError(err.message);
      }
    },
  });
  const restart = useGame((state) => state.restart);
  const status = useGame((state) => state.status);
  const score = useGame((state) => state.score);
  const [isGoodChain, setIsGoodChain] = useState<boolean>(false);
  const { chain, chains } = useNetwork();
  const [walletModalIsOpen, setWalletModalIsOpen] = useState<boolean>(false);
  const { address } = useAccount();

  useEffect(() => {
    if (waitForTransaction.data && waitForTransaction.isSuccess) {
      if (status === GameStatus.Ended) {
        restart();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.isSuccess, waitForTransaction.data]);

  useEffect(() => {
    const index = chains.findIndex((ch) => ch.id === chain?.id);
    if (index > -1) {
      setIsGoodChain(true);
    } else {
      setIsGoodChain(false);
    }
  }, [chain, chains]);

  const play = () => {
    if (!isGoodChain || status === GameStatus.NotConnected || !write) {
      setWalletModalIsOpen(true);
    } else {
      write?.();
    }
  };

  useEffect(() => {
    if (isGoodChain && status !== GameStatus.NotConnected) {
      setWalletModalIsOpen(false);
    }
  }, [isGoodChain, status]);

  return (
    <>
      {status === GameStatus.Ended && (
        <>
          <div>Your Score: {score}</div>
          <div className="btn-wrapper">
            <button
              disabled={isLoading}
              className="btn btn-primary fill bold"
              onClick={() => play()}
            >
              RESTART
            </button>
            {score > 0 && address && <SubmitScore />}
          </div>
          {walletModalIsOpen && (
            <Modal title="Error" onclose={() => setWalletModalIsOpen(false)}>
              {error != null && isGoodChain ? (
                <div>{error != null ? error : 'Une erreur est survenue'}</div>
              ) : (
                <ConnectWalletButton />
              )}
            </Modal>
          )}
          {(waitForTransaction.isLoading || isLoading) && (
            <Modal title="LOADING" onclose={() => setWalletModalIsOpen(false)}>
              Preparation of the game, please wait...
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default Restart;
