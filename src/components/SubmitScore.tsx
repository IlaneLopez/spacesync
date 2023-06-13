/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import JeuPodiumABI from '../utils/JeuPodiumABI.json';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useWaitForTransaction,
} from 'wagmi';
import useGame from '../stores/useGame';
import { ethers } from 'ethers';
import Modal from './Modal';

const SubmitScore: React.FC = () => {
  const { address } = useAccount();
  const provider = useProvider();

  const setIsScoreSubmited = useGame((state) => state.setIsScoreSubmited);
  const score = useGame((state) => state.score);
  const bestScore = useGame((state) => state.userBestScore);
  const [error, setError] = useState<string | undefined>();
  const [walletModalIsOpen, setWalletModalIsOpen] = useState<boolean>(false);
  const pot = useGame((state) => state.pot);

  const messageHash = ethers.utils.arrayify(
    ethers.utils.solidityKeccak256(['uint256', 'address'], [score, address])
  );

  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADRESS,
    abi: JeuPodiumABI,
    functionName: 'submitScore',
    args: [
      score,
      address,
      new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider).signMessage(
        messageHash
      ),
    ],
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
  const submitScore = useContractWrite(config);
  const waitForTransaction = useWaitForTransaction({
    hash: submitScore.data?.hash,
    onError(err: any) {
      if (err?.data?.message) {
        setError(err?.data?.message);
      } else {
        setError(err.message);
      }
    },
  });

  useEffect(() => {
    if (waitForTransaction.data && waitForTransaction.isSuccess) {
      setIsScoreSubmited(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForTransaction.data, waitForTransaction.isSuccess]);

  return (
    <>
      {!submitScore.isLoading &&
        !submitScore.isSuccess &&
        score > bestScore && (
          <button
            disabled={submitScore.isLoading}
            className="btn btn-primary outline"
            onClick={() => {
              if (error != null && !submitScore.write) {
                setWalletModalIsOpen(true);
              } else {
                submitScore.write?.();
              }
            }}
          >
            SUBMIT SCORE
          </button>
        )}
      {(waitForTransaction.isLoading || submitScore.isLoading) && (
        <button className="btn btn-warning outline">SUBMITING..</button>
      )}
      {waitForTransaction.isSuccess && (
        <a
          target="_blank"
          href={`https://twitter.com/intent/tweet?via=SpaceSync_&text=Just%20achieved%20an%20${score}points%20score%20in%20%23SpaceSync%20🕹%EF%B8%8F%20!%0A%0AThink%20you%20can%20outscore%20me%20%3F%20%0A%0ATry%20your%20luck%20on%20https://spacesync.app/%20and%20try%20to%20win%20over%20${pot.toFixed(
            4
          )}%20ETH%20on%20%23Zksync%20%21%0A%0A`}
          className="btn btn-success outline twitter-button"
          rel="noreferrer"
        >
          <img alt="twitter" src="/images/twitter-outline-success.png" />
          TWEET YOUR SCORE
        </a>
      )}
      {walletModalIsOpen && (
        <Modal title="Error" onclose={() => setWalletModalIsOpen(false)}>
          {error != null && <div>{error}</div>}
        </Modal>
      )}
    </>
  );
};

export default SubmitScore;
