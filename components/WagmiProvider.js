import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const APP_INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [infuraProvider({ apiKey: APP_INFURA_ID ?? '' }), publicProvider()],
);

console.log('New Wagmi Provider');

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Etherspot Buidler',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '15fcfb7323fcce5aa1b58afe4dc6d847',
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const WagmiProvider = ({ children }) => (
  <WagmiConfig config={config}>
    {children}
  </WagmiConfig>
);

export default WagmiProvider;
