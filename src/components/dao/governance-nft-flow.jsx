import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

import PlrDaoForm from './member-form';

export const OPENLOGIN_STORE = 'openlogin_store';
export const WAGMI_STORE = 'wagmi.store';

const LoadingComponent = () => <p>Loading...</p>;

const DaoMemberNftTx = lazy(() => import('./nft-transaction'));

const PlrDaoStakingBuilder = ({ shouldDisplayForm: shouldDisplaySignUpForm }) => {
  const [shouldDisplayPlrDaoForm, setShouldDisplayPlrDaoForm] = useState(false);
  const [shouldDisplayTxBuilder, setShouldDisplayTxBuilder] = useState(false);
  const [defaultFormData, setDefaultFormData] = useState({
    email: null,
    walletAddress: null,
  });
  const [manuallyConnectedAddress, setManuallyConnectedAddress] = useState(null);

  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { connector, isConnected, address } = useAccount();
  const [forceUpdate, setForceUpdate] = useState(0);

  //sign up form display
  const getNotionData = useCallback(async (payload) => {
    try {
      const response = await fetch('/api/plr-dao-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // If API is not configured, show the form if appropriate
        if (shouldDisplaySignUpForm) {
          setShouldDisplayPlrDaoForm(true);
        } else {
          setShouldDisplayTxBuilder(true);
        }
        return;
      }
      const data = await response.json();
      setFromNotionData(data);
    } catch (_) {
      // If API isn't available, show the form if appropriate
      if (shouldDisplaySignUpForm) {
        setShouldDisplayPlrDaoForm(true);
      } else {
        setShouldDisplayTxBuilder(true);
      }
    }
  }, [shouldDisplaySignUpForm]);

  const setFromNotionData = useCallback((data) => {
    // If user already submitted a form, hide form and move to transaction builder
    if (data?.isFormSubmitted) {
      setShouldDisplayPlrDaoForm(false);
      setShouldDisplayTxBuilder(true);
    } else {
      if (shouldDisplaySignUpForm) {
        setShouldDisplayPlrDaoForm(true);
      }
    }
  }, [shouldDisplaySignUpForm]);

  // Listen for custom wallet connected event as fallback
  useEffect(() => {
    const handleWalletConnected = (event) => {
      const eventAddress = event.detail?.address;
      if (eventAddress) {
        setManuallyConnectedAddress(eventAddress);

        const payload = {
          email: null,
          walletAddress: eventAddress,
        };
        setDefaultFormData(payload);
        getNotionData(payload);
      }

      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('walletConnected', handleWalletConnected);
    return () => window.removeEventListener('walletConnected', handleWalletConnected);
  }, [getNotionData]);

  // Handle wallet connection state changes
  useEffect(() => {
    if (!isConnected || !address) {
      // Only clear state if there's no manual connection
      if (!manuallyConnectedAddress) {
        setShouldDisplayPlrDaoForm(false);
        setShouldDisplayTxBuilder(false);
        setDefaultFormData({ email: null, walletAddress: null });
      }
      return;
    }

    // Wallet connected via wagmi - fetch data
    // Clear manual connection since wagmi is now connected
    if (manuallyConnectedAddress) {
      setManuallyConnectedAddress(null);
    }

    const payload = {
      email: null,
      walletAddress: address,
    };
    setDefaultFormData(payload);
    getNotionData(payload);
  }, [isConnected, address, connector, getNotionData, forceUpdate, manuallyConnectedAddress]);

  const onLogout = async () => {
    try {
      if (isConnected) {
        wagmiDisconnect();
      }
      setManuallyConnectedAddress(null);
      setShouldDisplayPlrDaoForm(false);
      setShouldDisplayTxBuilder(false);
      setDefaultFormData({ email: null, walletAddress: null });
    } catch (e) {
      console.error('onLogout error:', e);
    }
  };

  const onSubmitFormSuccess = () => {
    setShouldDisplayPlrDaoForm(false);
    setShouldDisplayTxBuilder(true);
  };

  // User is authenticated if either wagmi shows connected OR we got a manual connection event
  const isUserAuthenticated = (isConnected && address) || manuallyConnectedAddress;
  const shouldShowLogoutButton = isUserAuthenticated && !shouldDisplayPlrDaoForm && !shouldDisplayTxBuilder;

  return (
    <PlrDaoStakingBuilderWrapper>
      {!isUserAuthenticated && (
        <ConnectWalletWrapper>
          <Title id="connect-wallet" style={{ scrollMarginTop: '100px' }}>
            Connect Wallet
          </Title>
          <ConnectKitButton />
        </ConnectWalletWrapper>
      )}
      {isUserAuthenticated && shouldDisplaySignUpForm && shouldDisplayPlrDaoForm && (
        <PlrDaoForm
          defaultWalletAddress={defaultFormData.walletAddress}
          defaultEmail={defaultFormData.email}
          connector={connector}
          onSubmitForm={onSubmitFormSuccess}
          onLogout={onLogout}
        />
      )}
      {isUserAuthenticated && !shouldDisplayPlrDaoForm && shouldDisplayTxBuilder && (
        <Suspense fallback={<LoadingComponent />}>
          <DaoMemberNftTx onLogout={onLogout}></DaoMemberNftTx>
        </Suspense>
      )}
      {shouldShowLogoutButton && (
        <LogoutWrapper>
          <LoadingText>Loading your account information...</LoadingText>
          <LogoutButton onClick={onLogout}>Disconnect Wallet</LogoutButton>
        </LogoutWrapper>
      )}
    </PlrDaoStakingBuilderWrapper>
  );
};

export default PlrDaoStakingBuilder;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ConnectWalletWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #78e8f6;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: 'PTRootUIWebMedium', sans-serif;
`;

const LogoutWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 2rem 1.25rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: 'PTRootUIWebRegular', sans-serif;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoadingText = styled.p`
  color: #78e8f6;
  font-size: 1.25rem;
  margin: 0;
`;

const LogoutButton = styled.button`
  font-family: 'PTRootUIWebMedium', sans-serif;
  color: #fff;
  font-size: 1rem;
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  background-color: #5c0088;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45005f;
  }
`;
