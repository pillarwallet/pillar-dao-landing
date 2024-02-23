import { useState } from 'react';
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
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [web3AuthInstance, setWeb3AuthInstance] = useState(null);

  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connector, isConnected } = useAccount();

  const onWeb3ProviderSet = async (web3Provider) => {
    if (!web3Provider) {
      setConnectedProvider(null);
      return;
    }

    const web3 = new Web3(web3Provider);
    setConnectedProvider(web3.currentProvider);
  };

  const onLogout = async () => {
    try {
      if (isConnected) wagmiDisconnect();
      if (connector) await connector.disconnect();
    } catch (e) {
      console.error('onLogout', e);
    }

    try {
      if (web3AuthInstance) {
        await web3AuthInstance.logout({ cleanup: true });
        web3AuthInstance.clearCache();
      }
    } catch (e) {
      console.error('onLogout', e);
    }
    if (shouldDisplayForm) {
      setShouldDisplayPlrDaoForm(true);
    }
    setConnectedProvider(null);
  };

  return (
    <PlrStakingBuilderWrapper>
      {!connectedProvider && (
        <SignIn onlyMM onWeb3ProviderSet={onWeb3ProviderSet} onWeb3AuthInstanceSet={setWeb3AuthInstance} />
      )}
      {connectedProvider && (
        <Etherspot
          provider={connectedProvider}
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
      )}
    </PlrStakingBuilderWrapper>
  );
};

export default PlrStakingBuilder;

const PlrStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
