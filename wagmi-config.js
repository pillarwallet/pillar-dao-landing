import { http, createConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
} from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet, safe } from 'wagmi/connectors';
import pillarDaoIcon from '@images/pillar-dao-logo-purple-48px.png';

const blockchains = [
  polygon,
  mainnet,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
];
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

export const wagmiConfig = createConfig({
  chains: [...blockchains],
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
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${INFURA_ID}`),
    [polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${INFURA_ID}`),
    [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`),
    [bsc.id]: http(`https://bsc-mainnet.infura.io/v3/${INFURA_ID}`),
    [optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${INFURA_ID}`),
    [avalanche.id]: http(`https://avalanche-mainnet.infura.io/v3/${INFURA_ID}`),
    [celo.id]: http(`https://celo-mainnet.infura.io/v3/${INFURA_ID}`),
  },
});
