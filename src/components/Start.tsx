/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import JeuPodiumABI from '../utils/JeuPodiumABI.json';
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import useGame from '../stores/useGame';
import { GameStatus } from '../interfaces/GameStatus';
import ConnectWalletButton from './ConnectWalletButton';
import Modal from './Modal';
import { ethers } from 'ethers';

const Start: React.FC = () => {
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
  const start = useGame((state) => state.start);
  const status = useGame((state) => state.status);
  const [isGoodChain, setIsGoodChain] = useState<boolean>(false);
  const { chain, chains } = useNetwork();
  const [walletModalIsOpen, setWalletModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (waitForTransaction.data && waitForTransaction.isSuccess) {
      if (status === GameStatus.Ready) {
        start();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.data, waitForTransaction.isSuccess]);

  useEffect(() => {
    const index = chains.findIndex((ch) => ch.id === chain?.id);
    if (index > -1) {
      setIsGoodChain(true);
    } else {
      setIsGoodChain(false);
    }
  }, [chain, chains]);

  const play = () => {
    if (
      !isGoodChain ||
      status === GameStatus.NotConnected ||
      error != null ||
      !write
    ) {
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
      <li className="menu--item">
        <div className="dot"></div>
        <button disabled={isLoading} onClick={() => play()}>
          PLAY
        </button>
      </li>

      {walletModalIsOpen && (
        <Modal title="Error" onclose={() => setWalletModalIsOpen(false)}>
          {(isGoodChain && status !== GameStatus.NotConnected) ||
          error != null ? (
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
  );
};

export default Start;
