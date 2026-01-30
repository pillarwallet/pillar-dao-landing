import { useEffect } from "react";
import { WagmiProvider, createConfig, http, useConfig } from "wagmi";
import { reconnect } from "wagmi/actions";
import {
  mainnet,
  polygon,
  polygonAmoy,
  arbitrum,
  bsc,
  optimism,
  avalanche,
  celo,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const INFURA_ID = import.meta.env.VITE_INFURA_ID;
const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;

const config = createConfig(
  getDefaultConfig({
    appName: "Pillar DAO",
    appDescription: "Pillar DAO - Empowering Decentralized Governance",
    appUrl:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://pillardao.com",
    appIcon:
      typeof window !== "undefined"
        ? `${window.location.origin}/pillar-dao-logo-48px.png`
        : "https://pillardao.com/pillar-dao-logo-48px.png",
    enableFamily: false,

    // Your dApps chains
    chains: [
      polygon,
      polygonAmoy,
      mainnet,
      arbitrum,
      bsc,
      optimism,
      avalanche,
      celo,
    ],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(`https://mainnet.infura.io/v3/${INFURA_ID}`),
      [polygon.id]: http(`https://polygon-mainnet.infura.io/v3/${INFURA_ID}`),
      [arbitrum.id]: http(`https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`),
      [bsc.id]: http(`https://bsc-mainnet.infura.io/v3/${INFURA_ID}`),
      [optimism.id]: http(`https://optimism-mainnet.infura.io/v3/${INFURA_ID}`),
      [avalanche.id]: http(
        `https://avalanche-mainnet.infura.io/v3/${INFURA_ID}`,
      ),
      [celo.id]: http(`https://celo-mainnet.infura.io/v3/${INFURA_ID}`),
      [polygonAmoy.id]: http(`https://polygon-amoy.infura.io/v3/${INFURA_ID}`),
    },

    // Required API Keys
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
  }),
);

// Add polling to force account state updates
config.pollingInterval = 1000; // Poll every 1 second
config.syncConnectedChain = true; // Sync chain changes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Monitor component to handle WalletConnect connection state
const ConnectionMonitor = () => {
  const wagmiConfig = useConfig();

  // Listen to WalletConnect connector events directly
  useEffect(() => {
    const wcConnector = wagmiConfig.connectors.find(
      c => c.id === 'walletConnect' || c.name?.toLowerCase().includes('walletconnect')
    );

    if (!wcConnector) return;

    wcConnector.getProvider?.().then(provider => {
      if (!provider) return;

      let accountsChangedCount = 0;

      // When WalletConnect provider connects, force wagmi to sync
      provider.on?.('connect', async () => {
        try {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            await reconnect(wagmiConfig, { connectors: [wcConnector] });

            window.dispatchEvent(new CustomEvent('walletConnected', {
              detail: {
                address: accounts[0],
                connector: 'WalletConnect'
              }
            }));
          }
        } catch (err) {
          console.error("Error syncing WalletConnect connection:", err);
        }
      });

      // When accounts change, force wagmi to sync (only on first event)
      provider.on?.('accountsChanged', async (accounts) => {
        accountsChangedCount++;
        if (accountsChangedCount === 1 && accounts && accounts.length > 0) {
          try {
            await reconnect(wagmiConfig, { connectors: [wcConnector] });
          } catch (err) {
            console.error("Error syncing account change:", err);
          }

          window.dispatchEvent(new CustomEvent('walletConnected', {
            detail: {
              address: accounts[0],
              connector: 'WalletConnect'
            }
          }));
        }
      });
    }).catch(() => {
      // Provider not available yet, this is normal
    });
  }, [wagmiConfig]);

  return null;
};

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          mode="light"
          options={{
            initialChainId: 137,
            walletConnectName: 'WalletConnect and more',
            walletConnectCTA: 'link',
          }}
          theme="midnight"
          customTheme={{
            "--ck-connectbutton-background": "#5c0088",
            "--ck-connectbutton-hover-background": "#45005f",
            "--ck-primary-button-background": "#4b006e",
            "--ck-primary-button-hover-background": "#45005f",
          }}
        >
          <ConnectionMonitor />
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
