import { useEffect, useState } from "react";
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Web3 from 'web3';
import { useAccount, useDisconnect } from 'wagmi';

import { themeOverride } from '../styles/buidlerTheme';
import PlrDaoForm from "./form";

export const OPENLOGIN_STORE = 'openlogin_store';
export const WAGMI_STORE = 'wagmi.store';

const LoadingComponent = () => <p>Loading...</p>

const Etherspot = dynamic(() => import('@etherspot/react-transaction-buidler').then((mod) => mod.Etherspot), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const SignIn = dynamic(() => import('./plr-dao-buidler-sign-in'), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const PlrDaoStakingBuilder = ({ defaultTransactionBlock, shouldDisplayForm }) => {
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [web3AuthInstance, setWeb3AuthInstance] = useState(null);
  const [shouldDisplayPlrDaoForm, setShouldDisplayPlrDaoForm] = useState(true);
  const [defaultFormData, setDefaultFormData] = useState({
    email: null,
    walletAddress: null,
  });

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

  const getNotionData = async (payload) => {
    try {
      const response = await fetch('/api/plr-dao-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json();
      if (data?.isFormSubmitted) {
        setShouldDisplayPlrDaoForm(false);
      }
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    if (!connectedProvider) return;
    if (typeof window !== "undefined") {
      const wagmiStoreString = localStorage.getItem(WAGMI_STORE);
      const wagmiLocalStorageData = wagmiStoreString && JSON.parse(wagmiStoreString);

      const openLoginStoreString = localStorage.getItem(OPENLOGIN_STORE);
      const openLoginLocalStorageData = openLoginStoreString && JSON.parse(openLoginStoreString);

      if (!openLoginLocalStorageData?.email && !wagmiLocalStorageData?.state?.data?.account) return;

      const payload = {
        email: openLoginLocalStorageData?.email,
        walletAddress: wagmiLocalStorageData.state.data.account,
      }
      setDefaultFormData({ ...defaultFormData, ...payload });
      getNotionData(payload);
    }
  }, [connectedProvider]);

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
    if (shouldDisplayForm) {
      setShouldDisplayPlrDaoForm(true);
    }
    setConnectedProvider(null);
  }

  const onSubmitForm = () => {
    setShouldDisplayPlrDaoForm(false);
  }

  return <PlrDaoStakingBuilderWrapper>
    {!connectedProvider && (
      <SignIn
        onlyMM
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
          { type: defaultTransactionBlock },
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
    {shouldDisplayForm && connectedProvider && shouldDisplayPlrDaoForm &&
      (<PlrDaoForm
        defaultWalletAddress={defaultFormData.walletAddress}
        defaultEmail={defaultFormData.email}
        onSubmitForm={onSubmitForm}
      />)
    }
  </PlrDaoStakingBuilderWrapper>
}

export default PlrDaoStakingBuilder;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
