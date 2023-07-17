import { useState } from "react";
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Web3 from 'web3';
import { useAccount, useDisconnect } from 'wagmi';

import { themeOverride } from '../styles/buidlerTheme';

const LoadingComponent = () => <p>Loading...</p>

const Etherspot = dynamic(() => import('@etherspot/react-transaction-buidler').then((mod) => mod.Etherspot), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const SignIn = dynamic(() => import('./plr-dao-buidler-sign-in'), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const PlrDaoStakingBuilder = () => {
  console.log('PLR STAKING WITH 0.24.5');
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
  }

  const onLogout = async () => {
    try {
      if (isConnected) wagmiDisconnect();
      if (connector) await connector.disconnect();
    } catch (e) {
      //
    }

    try {
      if (web3AuthInstance) {
        await web3AuthInstance.logout({ cleanup: true });
        web3AuthInstance.clearCache();
      }
    } catch (e) {
      //
    }

    setConnectedProvider(null);
  }

  return <PlrDaoStakingBuilderWrapper>
    {!connectedProvider && (
      <SignIn
        onWeb3ProviderSet={onWeb3ProviderSet}
        onWeb3AuthInstanceSet={setWeb3AuthInstance}
      />
    )}
    {connectedProvider && (
      <Etherspot
        provider={connectedProvider}
        chainId={1}
        themeOverride={themeOverride}
        defaultTransactionBlocks={[
          { type: "PLR_DAO_STAKE" },
        ]}
        hideWalletToggle
        hideAddTransactionButton
        hideCloseTransactionBlockButton
        hideWalletSwitch
        hideBuyButton
        showMenuLogout
        onLogout={onLogout}
      />)}
  </PlrDaoStakingBuilderWrapper>
}

export default PlrDaoStakingBuilder;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;