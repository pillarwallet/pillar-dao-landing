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
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [web3AuthInstance, setWeb3AuthInstance] = useState(null);
  const [shouldDisplayPlrDaoForm, setShouldDisplayPlrDaoForm] = useState(false);
  const [defaultFormData, setDefaultFormData] = useState({
    email: '',
    walletAddress: '',
  });

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

  useEffect(() => {
    //wallet sign-in
    if (!connectedProvider && !address) return;
    const { wagmiData, openLoginData } = getAccountDataFromStore();
    //TODO: openLoginData (uses socials/email for wallet sign-in) may need to be updated before use
    if (!openLoginData?.email && !address) {
      console.log('No address or email from sign-in, logged out');
      onLogout();
      return;
    }
    const payload = {
      email: openLoginData?.email,
      walletAddress: address,
    };
    setDefaultFormData({ ...defaultFormData, ...payload });
    setShouldDisplayPlrDaoForm(true);
    getNotionData(payload);
  }, [connectedProvider, address, isConnected]);
  //sign up form display
  const getNotionData = async (payload) => {
    if (process.env.NEXT_PUBLIC_NOTION_DATABASE) {
      try {
        const response = await fetch('/api/plr-dao-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        //if user already submitted a form, hide form and move to transaction builder
        if (data?.isFormSubmitted) {
          setShouldDisplayPlrDaoForm(false);
          //show Etherspot builder
        }
      } catch (error) {
        console.error('Error fetching notion data:', error);
      }
    }
  };

  const getAccountDataFromStore = () => {
    if (typeof window === 'undefined') return { wagmiData: null, openLoginData: null };
    const wagmiStoreString = localStorage.getItem(WAGMI_STORE);
    const wagmiData = wagmiStoreString ? JSON.parse(wagmiStoreString) : null;
    const openLoginStoreString = localStorage.getItem(OPENLOGIN_STORE);
    const openLoginData = openLoginStoreString ? JSON.parse(openLoginStoreString) : null;
    return { wagmiData, openLoginData };
  };

  const onLogout = async () => {
    setDefaultFormData({
      email: '',
      walletAddress: '',
    });
    try {
      if (isConnected) wagmiDisconnect();
      if (connector) await connector.disconnect();
    } catch (e) {
      console.error('Error disconnecting wallet:', e);
    }

    try {
      if (web3AuthInstance) {
        await web3AuthInstance.logout({ cleanup: true });
        web3AuthInstance.clearCache();
      }
    } catch (e) {
      console.error('Error logging out of web3Auth:', e);
    }

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
