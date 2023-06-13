/* eslint-disable react/no-unknown-property */
import React from 'react';
import Game from './Game';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { zkSync } from '@wagmi/chains';
import { Web3Modal } from '@web3modal/react';
import { isMobile } from 'react-device-detect';
import Rotate from './components/Rotate';
import { publicProvider } from 'wagmi/providers/public';
import { Analytics } from '@vercel/analytics/react';

const chains = [zkSync];
const projectId = import.meta.env.VITE_PROJECT_ID;

const { provider } = configureChains(chains, [
  infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY }),
  publicProvider(),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);
function App() {
  return (
    <>
      <Analytics />
      {isMobile && (
        <>
          <Rotate />
        </>
      )}
      <>
        <WagmiConfig client={wagmiClient}>
          <Game />
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />{' '}
      </>
    </>
  );
}

export default App;
