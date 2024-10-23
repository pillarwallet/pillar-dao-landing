import { http, createConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
  // gnosis,
  // okc,
  // moonbeam,
  // fantom,
  // aurora,
} from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet, safe } from 'wagmi/connectors';
// import pillarDaoLogo from '../assets/images/pillar-dao-logo.png';
import pillarDaoIcon from '@images/pillar-dao-logo-purple-48px.png';

const blockchains = [
  polygon,
  mainnet,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
  // gnosis,
  // okc,
  // moonbeam,
  // fantom,
  // aurora,
];
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

export const wagmiConfig = createConfig({
  chains: [mainnet],
  ssr: true, //server-side rendering
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Pillar DAO Governance Staking',
        url: 'https://pillardao.org/',
      },
    }),
    walletConnect({
      projectId: process.env.WALLET_CONNECT_PROJECT_ID || '15fcfb7323fcce5aa1b58afe4dc6d847',
      showQrModal: true,
      metadata: {
        name: 'Pillar DAO Governance Staking',
        description: 'Pillar DAO',
        url: 'https://pillardao.org/',
        icons: [pillarDaoIcon],
      },
    }),
    coinbaseWallet({
      appName: 'Pillar DAO Governance Staking',
      appLogoUrl: pillarDaoIcon || '',
    }),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
    [polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`),
    [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`),
    [bsc.id]: http(`https://bsc-mainnet.infura.io/v3/${INFURA_KEY}`),
    [optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`),
    [avalanche.id]: http(`https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`),
    [celo.id]: http(`https://celo-mainnet.infura.io/v3/${INFURA_KEY}`),
    // [okc.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
    // [moonbeam.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
    // [fantom.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
    // [aurora.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
    // [gnosis.id]: http(`https://mainnet.infura.io/v3/${INFURA_KEY}`),
  },
});
