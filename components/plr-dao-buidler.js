import { useEffect, useState } from "react";
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Web3 from 'web3';
import { useAccount, useDisconnect } from 'wagmi';

import { themeOverride } from '../styles/buidlerTheme';
import PlrDaoForm from "./form";

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
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [web3AuthInstance, setWeb3AuthInstance] = useState(null);
  const [shouldDisplayPlrDaoForm, setShouldDisplayPlrDaoForm] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      var isFormSubmitted = localStorage.getItem('plt-dao-form-submitted');
      setShouldDisplayPlrDaoForm(!isFormSubmitted);
    }
  }, [connectedProvider]);

  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connector, isConnected, address } = useAccount();

  const onWeb3ProviderSet = async (web3Provider) => {
    if (!web3Provider) {
      setConnectedProvider(null);
      return;
    }

    const web3 = new Web3(web3Provider);
    setConnectedProvider(web3.currentProvider);
  }

  const getNotionData = async () => {
    try {
      const response = await fetch('/api/plr-dao-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address
        }),
      })
      const { data } = await response.json();
      if(data?.length) {
        setShouldDisplayPlrDaoForm(false);
        localStorage.setItem('plt-dao-form-submitted', true);
      }
    } catch(error) {
      //
    }
  }

  useEffect(() => {
    if(!address) return;
    getNotionData();
  }, [address, connectedProvider]);

  const onLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('plt-dao-form-submitted');
    }
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
    setShouldDisplayPlrDaoForm(true);
    setConnectedProvider(null);
  }

  const onSubmitForm = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem('plt-dao-form-submitted', true);
    }
    setShouldDisplayPlrDaoForm(false);
  }

  return <PlrDaoStakingBuilderWrapper>
    {!connectedProvider && (
      <SignIn
        onWeb3ProviderSet={onWeb3ProviderSet}
        onWeb3AuthInstanceSet={setWeb3AuthInstance}
      />
    )}
    {connectedProvider && !shouldDisplayPlrDaoForm &&
      (<Etherspot
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
      />)
    }
    {connectedProvider && shouldDisplayPlrDaoForm &&
      (<PlrDaoForm defaultWalletAddress={address} onSubmitForm={onSubmitForm} />)
    }
  </PlrDaoStakingBuilderWrapper>
}

export default PlrDaoStakingBuilder;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;