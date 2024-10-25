import { useEffect, useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Web3 from 'web3';
import { useAccount, useDisconnect } from 'wagmi';

import { themeOverride } from '../styles/buidlerTheme';
import PlrDaoForm from './form';

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

const PlrDaoStakingBuilder = ({ defaultTransactionBlock, shouldDisplayForm }) => {
  const [shouldDisplayPlrDaoForm, setShouldDisplayPlrDaoForm] = useState(false);
  const [defaultFormData, setDefaultFormData] = useState({
    email: null,
    walletAddress: null,
  });
  //web3
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [web3AuthInstance, setWeb3AuthInstance] = useState(null);
  //wagmi
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connector, isConnected, address } = useAccount();

  const onWeb3ProviderSet = async (web3Provider) => {
    if (!web3Provider) {
      setConnectedProvider(null);
      return;
    }
    const web3 = new Web3(web3Provider);
    setConnectedProvider(web3.currentProvider);
  };

  const getNotionData = async (payload) => {
    try {
      const response = await fetch('/api/plr-dao-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setFromNotionData(data);
    } catch (error) {
      console.error('Error fetching notion data:', error);
    }
  };
  
  const setFromNotionData = (data) => {
    // If user already submitted a form, hide form and move to transaction builder
    console.log(data?.isFormSubmitted, 'form status');
    if (data?.isFormSubmitted) {
      setShouldDisplayPlrDaoForm(false);
      // Show Etherspot builder
    } else {
      setShouldDisplayPlrDaoForm(true);
    }
  };
  

  useEffect(() => {
    if (!connectedProvider && !isConnected) return;
    if (typeof window === 'undefined') return;
    const openLoginStoreString = localStorage.getItem(OPENLOGIN_STORE);
    const openLoginLocalStorageData = openLoginStoreString && JSON.parse(openLoginStoreString);

    const email = openLoginLocalStorageData?.email || defaultFormData.email;
    const walletAddress = address;
    console.log(email, walletAddress, 'test');
    if (!email && !walletAddress) return;

    const payload = {
      email,
      walletAddress,
    };
    setDefaultFormData((prevData) => ({ ...prevData, email, walletAddress }));
    getNotionData(payload);
  }, [connectedProvider, address]);

  const onLogout = async () => {
    //wagmi
    try {
      if (isConnected) wagmiDisconnect();
      if (connector) await connector.disconnect();
    } catch (e) {
      console.error('Error disconnecting wallet:', e);
    }
    //web3
    try {
      if (web3AuthInstance) {
        await web3AuthInstance.logout({ cleanup: true });
        web3AuthInstance.clearCache();
      }
    } catch (e) {
      console.error('Error logging out of web3Auth:', e);
    }
    //cleanup
    setDefaultFormData({
      email: null,
      walletAddress: null,
    });
    if (shouldDisplayForm) {
      setShouldDisplayPlrDaoForm(true);
    }
    setConnectedProvider(null);
  };

  const onSubmitForm = () => {
    setShouldDisplayPlrDaoForm(false);
  };

  return (
    <PlrDaoStakingBuilderWrapper>
      {!connectedProvider && !isConnected && (
        <SignIn includeMM includeWC onWeb3ProviderSet={onWeb3ProviderSet} onWeb3AuthInstanceSet={setWeb3AuthInstance} />
      )}
      {(connectedProvider || isConnected) && shouldDisplayForm && shouldDisplayPlrDaoForm && (
        <PlrDaoForm
          defaultWalletAddress={defaultFormData.walletAddress}
          defaultEmail={defaultFormData.email}
          connector={connector}
          onSubmitForm={onSubmitForm}
          onLogout={onLogout}
        />
      )}
      {(connectedProvider || isConnected) && !shouldDisplayPlrDaoForm && (
        <Etherspot
          provider={connectedProvider}
          chainId={1}
          themeOverride={themeOverride}
          defaultTransactionBlocks={[{ type: defaultTransactionBlock }]}
          hideWalletToggle
          hideAddTransactionButton
          hideCloseTransactionBlockButton
          hideWalletSwitch
          hideBuyButton
          showMenuLogout
          onLogout={onLogout}
        />
      )}
    </PlrDaoStakingBuilderWrapper>
  );
};

export default PlrDaoStakingBuilder;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
