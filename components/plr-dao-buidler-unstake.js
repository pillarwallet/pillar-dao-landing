import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';
import Web3 from 'web3';
import UnstakeButton from './unstake-button';

export const OPENLOGIN_STORE = 'openlogin_store';
export const WAGMI_STORE = 'wagmi.store';

const polygonChainId = Number(process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID || 137);
const daoContractAddress = process.env.NEXT_PUBLIC_DAO_CONTRACT || '0xc380f15Db7be87441d0723F19fBb440AEaa734aB';
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN || '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774';
const stakeToken = process.env.NEXT_PUBLIC_STAKE_AMOUNT || '10000';
const stakeTokenAmount = ethers.utils.parseUnits(stakeToken, 18);
const explorer = process.env.NEXT_PUBLIC_CHAIN_EXPLORER || `https://polygonscan.com/tx/`;

const LoadingComponent = () => <p>Loading...</p>;

const DaoMemberNftTx = dynamic(() => import('./dao-member-nft-signup-tx'), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const Etherspot = dynamic(() => import('@etherspot/react-transaction-buidler').then((mod) => mod.Etherspot), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const SignIn = dynamic(() => import('./plr-dao-buidler-sign-in'), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

const PlrDaoStakingBuilderUnstake = ({ defaultTransactionBlock, shouldDisplayForm: shouldDisplaySignUpForm }) => {
  const [shouldDisplayPlrDaoForm, setShouldDisplayPlrDaoForm] = useState(false);
  const [shouldDisplayTxBuilder, setShouldDisplayTxBuilder] = useState(false);
  const [defaultFormData, setDefaultFormData] = useState({
    email: null,
    walletAddress: null,
  });
  //web3
  const [connectedProvider, setConnectedProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
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
    setWeb3(web3);
    setConnectedProvider(web3?.currentProvider);
  };

  useEffect(() => {
    //wallet sign-in
    if (!connectedProvider && !address) return;
    const { wagmiData, openLoginData } = getAccountDataFromStore();
    //TODO: openLoginData (uses socials/email for wallet sign-in) may need to be updated before use
    if (!openLoginData?.email && !address) {
      onLogout();
      return;
    }
    const payload = {
      email: openLoginData?.email,
      walletAddress: address,
    };
    setDefaultFormData({ ...defaultFormData, ...payload });
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
        setFromNotionData(data);
      } catch (error) {
        //
      }
    }
  };

  const setFromNotionData = (data) => {
    // If user already submitted a form, hide form and move to transaction builder
    if (data?.isFormSubmitted) {
      setShouldDisplayPlrDaoForm(false);
      setShouldDisplayTxBuilder(true);
    } else {
      if (shouldDisplaySignUpForm) {
        setShouldDisplayPlrDaoForm(true);
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
  useEffect(() => {
    if (!connectedProvider && !isConnected) return;
    if (typeof window === 'undefined') return;
    const openLoginStoreString = localStorage.getItem(OPENLOGIN_STORE);
    const openLoginLocalStorageData = openLoginStoreString && JSON.parse(openLoginStoreString);

    const email = openLoginLocalStorageData?.email || defaultFormData.email;
    const walletAddress = address;
    if (!email && !walletAddress) {
      onLogout();
      return;
    }

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
      //
    }
    //web3
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
      console.error('onLogout');
    }
    //cleanup
    setDefaultFormData({
      email: null,
      walletAddress: null,
    });
    if (shouldDisplaySignUpForm) {
      setShouldDisplayPlrDaoForm(false);
    }
    setConnectedProvider(null);
  };

  const onSubmitFormSuccess = () => {
    setShouldDisplayPlrDaoForm(false);
    setShouldDisplayTxBuilder(true);
  };

  return (
    <PlrDaoStakingBuilderWrapper>
      {!connectedProvider && !isConnected && (
        <SignIn includeMM includeWC onWeb3ProviderSet={onWeb3ProviderSet} onWeb3AuthInstanceSet={setWeb3AuthInstance} />
      )}
      {isConnected && (
        <UnstakeButton chainId={polygonChainId} contract={daoContractAddress} explorer={explorer}></UnstakeButton>
      )}
    </PlrDaoStakingBuilderWrapper>
  );
};

export default PlrDaoStakingBuilderUnstake;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
