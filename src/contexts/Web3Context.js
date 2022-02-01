import { useContext, useMemo, createContext, useCallback, useState, useEffect } from 'react';
import Onboard from 'bnc-onboard';
import { ethers } from 'ethers';

// constants
import { STORAGE_KEY } from '../constants/storageConstants';

// utils
import { getItem, setItem } from '../utils/storage';
import { isMainnet, chainIdToNetworkName } from '../utils/common';


const WalletService = (onAddress, onProvider, onNetwork, chainId = +process.env.NEXT_PUBLIC_NETWORK_ID) => Onboard({
  walletSelect: {
    wallets: [
      { walletName: "metamask", preferred: true },
      {
        walletName: "walletConnect",
        preferred: true,
        rpc: {
          [137]: 'https://polygon-rpc.com',
          [80001]: 'https://rpc-mumbai.maticvigil.com/',
          [4]: `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
          [1]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
        }
      },
    ],
  },
  subscriptions: {
    wallet: ({ provider }) => {
      onProvider(provider);
    },
    address: (address) => {
      onAddress(address);
    },
    network: (networkId) => {
      onNetwork(networkId);
    },
  },
  networkId: chainId,
});

export const Web3Context = createContext(null);

const Web3ContextProvider = ({ children, chainId }) => {
  const web3Context = useContext(Web3Context);
  if (web3Context !== null) {
    throw new Error('<Web3ContextProvider /> has already been declared.');
  }

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [connectedNetworkId, setConnectedNetworkId] = useState(null);

  const walletService = useMemo(() => WalletService(
    (address) => {
      if (address) setConnectedAddress(address);
    },
    (provider) => {
      if (provider) setConnectedProvider(new ethers.providers.Web3Provider(provider, chainIdToNetworkName[process.env.NEXT_PUBLIC_NETWORK_ID]));
    },
    (networkId) => {
      if (networkId) setConnectedNetworkId(networkId);
    },
    chainId,
  ), [chainId]);

  useEffect(() => {
    const savedConnectedAddress = getItem(STORAGE_KEY.CONNECTED_WALLET_ADDRESS);
    if (savedConnectedAddress) setConnectedAddress(savedConnectedAddress);

    const savedWalletProvider = getItem(STORAGE_KEY.CONNECTED_WALLET_PROVIDER);
    if (savedWalletProvider) {
      setIsConnecting(true);
      walletService.walletSelect(savedWalletProvider)
        .then(() => {
          setIsConnecting(false);
        })
        .catch(() => {
          setIsConnecting(false);
        });
    }
  }, [walletService]);

  const connect = useCallback(async () => {
    setIsConnecting(true);

    await walletService.walletSelect().catch(() => null);
    await walletService.walletCheck().catch(() => null);

    const { address, wallet: { name } } = walletService.getState();

    if (address) {
      setConnectedAddress(address);
      setItem(STORAGE_KEY.CONNECTED_WALLET_ADDRESS, address);
    }

    if (name) {
      setItem(STORAGE_KEY.CONNECTED_WALLET_PROVIDER, name);
    }

    setIsConnecting(false);
  }, [walletService]);

  const reset = useCallback(() => {
    setItem(STORAGE_KEY.CONNECTED_WALLET_ADDRESS, '');
    setItem(STORAGE_KEY.CONNECTED_WALLET_PROVIDER, '');
    walletService.walletReset();
    setConnectedAddress(null);
  }, [walletService]);

  const contextData = useMemo(() => ({
    connect,
    reset,
    isConnecting,
    connectedAddress,
    connectedProvider,
    connectedNetworkId,
    chainId,
  }), [
    connect,
    reset,
    isConnecting,
    connectedAddress,
    connectedProvider,
    connectedNetworkId,
    chainId,
  ]);

  return (
    <Web3Context.Provider value={{ data: contextData }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3ContextProvider;
