/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import useGame from '../stores/useGame';

import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';

const ConnectWalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const connectWallet = useGame((state) => state.connect);
  const disconnectWallet = useGame((state) => state.disconnect);
  const { open } = useWeb3Modal();
  const [isGoodChain, setIsGoodChain] = useState<boolean>(false);
  const { chain, chains } = useNetwork();
  const switchNetworkState = useSwitchNetwork();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  }, [isConnected, address, connectWallet, disconnectWallet]);

  useEffect(() => {
    const index = chains.findIndex((ch) => ch.id === chain?.id);
    if (index > -1) {
      setIsGoodChain(true);
    } else {
      setIsGoodChain(false);
    }
  }, [chain, chains]);

  return (
    <>
      {!address && (
        <button onClick={() => open()} className="btn btn-primary outline">
          CONNECT WALLET
        </button>
      )}
      {!isGoodChain && address && (
        <>
          {switchNetworkState.chains.map((x) => (
            <button
              disabled={!switchNetworkState.switchNetwork || x.id === chain?.id}
              key={x.id}
              onClick={() => switchNetworkState.switchNetwork?.(x.id)}
              className="btn btn-warning outline"
            >
              Switch to {x.name} network
              {switchNetworkState.isLoading &&
                switchNetworkState.pendingChainId === x.id &&
                ' (switching)'}
            </button>
          ))}
        </>
      )}
      {address && isGoodChain && (
        <button
          onClick={() => disconnect()}
          className="btn btn-primary outline"
        >
          DISCONNECT
        </button>
      )}
    </>
  );
};

export default ConnectWalletButton;
