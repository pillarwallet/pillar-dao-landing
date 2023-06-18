import React, { useState } from "react";
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Web3 from 'web3';
import { useAccount, useDisconnect } from 'wagmi';

import { themeOverride } from '../styles/buidlerTheme';

const Etherspot = dynamic(() => import('@etherspot/react-transaction-buidler').then((mod) => mod.Etherspot), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const SignIn = dynamic(() => import('./plr-dao-buidler-sign-in'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PlrDaoStakingBuilder = () => {
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
        onLogout={async () => {
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
        }}
      />)}
  </PlrDaoStakingBuilderWrapper>
}
export default PlrDaoStakingBuilder;