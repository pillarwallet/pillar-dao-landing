// components/WagmiProvider.js

import React, { useEffect, useState } from 'react';
import {
  gnosis,
  mainnet,
  polygon,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
  okc,
  moonbeam,
  fantom,
  aurora,
} from 'wagmi/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const APP_INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const WagmiProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const initializeWagmi = () => {
      const { chains, publicClient, webSocketPublicClient } = configureChains(
        [polygon, mainnet, gnosis, arbitrum, bsc, optimism, avalanche, celo, okc, moonbeam, fantom, aurora],
        [infuraProvider({ apiKey: APP_INFURA_ID ?? '' }), publicProvider()],
      );

      const wagmiConfig = createConfig({
        autoConnect: true,
        connectors: [
          new MetaMaskConnector({
            chains,
            options: {
              // Optional configurations
            },
          }),
          new CoinbaseWalletConnector({
            chains,
            options: {
              appName: 'Pillar DAO',
            },
          }),
          new WalletConnectConnector({
            chains,
            options: {
              isNewChainsStale: false,
              projectId: WALLET_CONNECT_PROJECT_ID ?? '15fcfb7323fcce5aa1b58afe4dc6d847',
              showQrModal: true,
            },
          }),
        ],
        publicClient,
        webSocketPublicClient,
      });

      // Log connector readiness
      wagmiConfig.connectors.forEach((connector) => {
        console.log(`Connector: ${connector.name}`);
        console.log(`ID: ${connector.id}`);
        console.log(`Ready: ${connector.ready}`);
      });

      setConfig(wagmiConfig);
    };

    initializeWagmi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log window.ethereum
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('window.ethereum:', window.ethereum);
      if (window.ethereum) {
        console.log('MetaMask is installed.');
        console.log('window.ethereum.isMetaMask:', window.ethereum.isMetaMask);
      } else {
        console.log('MetaMask is NOT installed.');
      }
    }
  }, []);

  if (!config) {
    return null; // or a loading spinner
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

export default WagmiProvider;
