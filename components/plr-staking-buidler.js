import { useState, useEffect } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Web3 from 'web3';
import { useAccount, useDisconnect } from 'wagmi';

import { themeOverride } from '../styles/buidlerTheme';

export const OPENLOGIN_STORE = 'openlogin_store';
export const WAGMI_STORE = 'wagmi.store';

const LoadingComponent = () => <p>Loading...</p>;

const Etherspot = dynamic(() => import('@etherspot/react-transaction-buidler').then((mod) => mod.Etherspot), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const SignIn = dynamic(() => import('./plr-dao-buidler-sign-in'), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const PlrStakingBuilder = ({ defaultTransactionBlock, shouldDisplayForm }) => {
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connector: wagmiConnector, isConnected, address } = useAccount();
  const [wagmiProvider, setWagmiProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [connectedWeb3Provider, setConnectedWeb3Provider] = useState(null);
  const [web3AuthInstance, setWeb3AuthInstance] = useState(null);
  const [showEtherspotPanel, setShowEtherspotPanel] = useState(false);
  const [provider, setProvider] = useState(null);

  //wagmi provider
  useEffect(() => {
    const getProvider = () => {
      if (wagmiConnector && isConnected && address) {
        wagmiConnector?.getProvider().then((wagmiProvider) => {
          if (wagmiProvider) {
            setWagmiProvider(wagmiProvider);
          }
        });
      }
    };
    getProvider();
  }, [wagmiConnector, isConnected, address]);

  //web3 provider
  const onWeb3ProviderSet = async (web3Provider) => {
    if (!web3Provider) {
      setConnectedWeb3Provider(null);
      return;
    }
    const web3 = new Web3(web3Provider);
    setWeb3(web3);
    setConnectedWeb3Provider(web3?.currentProvider);
  };

  const onLogout = async () => {
    try {
      if (isConnected) wagmiDisconnect();
      if (wagmiConnector) await wagmiConnector.disconnect();
    } catch (e) {
      console.error('onLogout', e);
    }
    try {
      if (web3AuthInstance) {
        try {
          await web3AuthInstance.logout({ cleanup: true });
          web3AuthInstance.clearCache();
        } catch (error) {
          console.error('onLogout web3');
        }
      }
    } catch (e) {
      console.error('onLogout', e);
    }
    if (shouldDisplayForm) {
      setShouldDisplayPlrDaoForm(true);
    }
    setConnectedWeb3Provider(null);
    setWagmiProvider(null);
  };

  useEffect(() => {
    //pick provider
    if (connectedWeb3Provider) {
      setProvider(connectedWeb3Provider);
      setShowEtherspotPanel(true);
    } else if (wagmiProvider) {
      setProvider(wagmiProvider);
      setShowEtherspotPanel(true);
    } else {
      setProvider(null);
      setShowEtherspotPanel(false);
    }
  });

  return (
    <PlrStakingBuilderWrapper>
      {!provider && (
        <SignIn includeMM onWeb3ProviderSet={onWeb3ProviderSet} onWeb3AuthInstanceSet={setWeb3AuthInstance} />
      )}
      {showEtherspotPanel && provider && (
        <>
          <Etherspot
            provider={provider}
            chainId={137}
            themeOverride={themeOverride}
            defaultTransactionBlocks={[{ type: defaultTransactionBlock, closeable: false }]}
            hideWalletToggle
            hideAddTransactionButton
            hideBuyButton
            showMenuLogout
            onLogout={onLogout}
            onlyPolygonInPLRStaking
            plrStakingTitle="Pillar Staking Program"
          />
          <div>Compatible browsers: Chrome, Firefox</div>
        </>
      )}
    </PlrStakingBuilderWrapper>
  );
};

export default PlrStakingBuilder;

const PlrStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
