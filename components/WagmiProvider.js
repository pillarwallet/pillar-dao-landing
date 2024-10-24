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

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, mainnet, gnosis, arbitrum, bsc, optimism, avalanche, celo, okc, moonbeam, fantom, aurora],
  [infuraProvider({ apiKey: APP_INFURA_ID ?? '' }), publicProvider()]
);

const client = createConfig({
  autoConnect: true,
  //TODO: find out why MetaMask connector errors on Brave browser "connector not found" with wagmi 1.3.10
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
        isNewChainsStale: false,
        projectId: process.env.WALLET_CONNECT_PROJECT_ID ?? '15fcfb7323fcce5aa1b58afe4dc6d847',
        showQrModal: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const WagmiProvider = ({ children }) => <WagmiConfig config={client}>{children}</WagmiConfig>;

export default WagmiProvider;