import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { BsGithub, BsTwitter } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import { TorusWalletAdapter } from '@web3auth/torus-evm-adapter';
import { useConnect, useAccount } from 'wagmi';

import iconMetamask from '../assets/images/builder/icon-metamask.png';
import iconWalletConnect from '../assets/images/builder/icon-walletconnect.png';
import iconGoogle from '../assets/images/builder/icon-google.png';
import iconApple from '../assets/images/builder/icon-apple.png';
import iconFacebook from '../assets/images/builder/icon-facebook.png';
import iconDiscord from '../assets/images/builder/icon-discord.png';
import iconTwitch from '../assets/images/builder/icon-twitch.png';
import iconCoinbase from '../assets/images/builder/icon-coinbase.png';

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const APP_CHAIN_ID_HEX = process.env.NEXT_PUBLIC_CHAIN_ID_HEX;
const APP_INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

//#region Styled
const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.875rem 1.25rem 1.625rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: 'PTRootUIWebRegular', sans-serif;
  color: #fff;
  text-align: center;
  user-select: none;
`;

const WrapperTitle = styled.h1`
  color: #78e8f6;
  font-size: 1.25rem;
  margin-bottom: 1.875rem;
`;

const WrapperText = styled.span`
  font-size: 0.875rem;
  text-align: ${({ textAlign }) => textAlign ?? 'center'};
`;

const LoadingBarWrapper = styled.div`
  height: 6px;
  padding: 2px 7.375rem 2px 2px;
  border-radius: 5px;
  background-color: rgba(71, 64, 120, 0.4);
  margin-bottom: 0.813rem;
`;

const LoadingBar = styled.div`
  height: 6px;
  border-radius: 3px;
  width: 13.375rem;
  background: #720898;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 1.875rem;
  text-decoration: underline;
`;

const WrapperTextClickable = styled(WrapperText)`
  cursor: pointer;
  color: #78e8f6;

  &:hover {
    opacity: 0.7;
  }
`;

const SwitchWrapper = styled.div`
  padding: 1px;
  border-radius: 8px;
  background: #000;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.875rem;
`;

const SwitchOption = styled.div`
  font-size: 0.875rem;
  width: 50%;
  text-align: center;
  min-height: 1.75rem;
  line-height: 2.125rem;
  cursor: pointer;
  color: #78e8f6;
  background: #4e0372;
  border-radius: 0.5rem;
  padding: 1px;

  ${({ isActive }) =>
    isActive &&
    `
    color: #000;
    font-weight: bold;
    box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
    border-style: solid;
    border-width: 1px;
    border-image-slice: 1;
    background: #78e8f6;
    line-height: 2rem;
  `}
`;

const SignInOptionsWrapper = styled.div`
  margin-bottom: 0.875rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SignInOptionWrapper = styled.div`
  width: ${({ half }) => (half ? 'calc(50% - 7px)' : '100%')};
  ${({ half }) =>
    half &&
    `
  min-width: 9.375rem;
  flex: 1;
  margin: 0px 4px;
  `}
`;

const SignInOptionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  img {
    margin: 0;
    height: 1.5rem;
  }
`;

const SignInOption = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'PTRootUIWebMedium', sans-serif;
  color: #fff;
  font-size: 1rem;
  padding: 1.75rem 2.125rem;
  border-radius: 1.5rem;
  background-color: #5c0088;
  margin-bottom: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: #45005f;
  }
`;

const EmailInput = styled.input`
  margin-bottom: 1.875rem;
  padding: 1rem 0.813rem;
  border-radius: 0.75rem;
  border: solid 1px #49437d;
  font-family: 'PTRootUIWebMedium', sans-serif;
  font-size: 1rem;
  color: #fff;
  background-color: #1a1726;
  width: calc(100% - 34px);

  &::placeholder {
    color: #78e8f6;
  }

  &:focus {
    outline: #78e8f6 solid 1px;
  }
`;

const EmailSubmitButton = styled.button`
  cursor: pointer;
  margin-bottom: 0.875rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background: #890df8;
  font-family: 'PTRootUIWebRegular', sans-serif;
  text-align: center;
  color: #fff;
  font-size: 1.25rem;
  width: 100%;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    opacity: 0.7;
  }
`;
//#endregion Styled

const iconById = {
  metaMask: <img src={iconMetamask} alt="metamask" />,
  walletConnect: <img src={iconWalletConnect} alt="walletconnect" />,
  coinbaseWallet: <img src={iconCoinbase} alt="coinbase" />,
};

const SignIn = ({ onWeb3ProviderSet, onWeb3AuthInstanceSet, includeMM, includeWC }) => {
  const [showSocialLogins, setShowSocialLogins] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [web3Auth, setWeb3Auth] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const initWeb3AuthCore = async () => {
      if (!!localStorage.getItem('Web3Auth-cachedAdapter')) setIsSigningIn(true);

      const web3AuthInstance = new Web3AuthNoModal({
        clientId: WEB3AUTH_CLIENT_ID,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: APP_CHAIN_ID_HEX,
          rpcTarget: `https://polygon-mainnet.infura.io/v3/${APP_INFURA_ID}`,
        },
        storageKey: 'local',
      });

      const openLoginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: 'mainnet',
          clientId: WEB3AUTH_CLIENT_ID,
        },
        loginSettings: {
          mfaLevel: 'none',
        },
      });

      web3AuthInstance.configureAdapter(openLoginAdapter);

      const torusWalletAdapter = new TorusWalletAdapter({ clientId: WEB3AUTH_CLIENT_ID });
      web3AuthInstance.configureAdapter(torusWalletAdapter);

      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, () => {
        if (!web3AuthInstance?.provider) return;
        onWeb3ProviderSet(web3AuthInstance.provider);
        setIsSigningIn(false);
      });

      web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, () => {
        setIsSigningIn(false);
      });

      await web3AuthInstance.init();
      setIsSigningIn(false);

      setWeb3Auth(web3AuthInstance);

      if (onWeb3AuthInstanceSet) onWeb3AuthInstanceSet(web3AuthInstance);
    };

    initWeb3AuthCore();
    /* eslint-disable-next-line */
  }, []);

  const { connector, isConnected } = useAccount();

  useEffect(() => {
    const update = async () => {
      if (!connector?.ready || !isConnected) return;
      const wagmiWeb3Provider = await connector.getProvider();
      onWeb3ProviderSet(wagmiWeb3Provider);
    };
    update();
  }, [connector, isConnected, onWeb3ProviderSet]);

  const { connect, connectors } = useConnect();

  const loginWithAdapter = useCallback(
    async (adapter, loginProvider, login_hint) => {
      setErrorMessage(null);
      setIsSigningIn(true);

      if (!web3Auth) {
        setIsSigningIn(false);
        return;
      }

      let web3authProvider;
      try {
        web3authProvider = await web3Auth.connectTo(adapter, { loginProvider, login_hint });
      } catch (e) {
        setErrorMessage(`Failed to login! Reason: ${e instanceof Error && e?.message ? e.message : 'unknown'}.`);
        setIsSigningIn(false);
        return;
      }

      if (!web3authProvider) {
        setErrorMessage('Failed to get connected provider!');
        setIsSigningIn(false);
        return;
      }

      onWeb3ProviderSet(web3authProvider);
      setEmail('');
      setShowEmailLogin(false);
      setIsSigningIn(false);
    },
    [web3Auth, onWeb3ProviderSet],
  );

  const loginWithOpenLogin = useCallback(
    async (loginProvider, login_hint) => loginWithAdapter(WALLET_ADAPTERS.OPENLOGIN, loginProvider, login_hint),
    [loginWithAdapter],
  );

  useEffect(() => {
    setErrorMessage(null);
  }, [showSocialLogins, showMoreOptions]);

  const visibleSignInOptions = useMemo(() => {
    const options = [];

    /* Set only one or few connectors with include useMemo options */
    if (includeMM) {
      const metaMask = connectors.find((connector) => connector.id === 'metaMask');
      if (metaMask) {
        options.push({
          title: metaMask.name,
          icon: iconById[metaMask.id],
          onClick: () => connect({ connector: metaMask }),
        });
      }
    }
    if (includeWC) {
      const walletConnect = connectors.find((connector) => connector.id === 'walletConnect');
      if (walletConnect) {
        options.push({
          title: walletConnect.name,
          icon: iconById[walletConnect.id],
          onClick: () => connect({ connector: walletConnect }),
        });
      }
    }
    if (options.length > 0) {
      return options;
    }

    const signInOptions = {
      social: [
        { title: 'Google', icon: <img src={iconGoogle} alt="google" />, onClick: () => loginWithOpenLogin('google') },
        { title: 'Apple', icon: <img src={iconApple} alt="apple" />, onClick: () => loginWithOpenLogin('apple') },
        {
          title: 'Facebook',
          icon: <img src={iconFacebook} alt="facebook" />,
          onClick: () => loginWithOpenLogin('facebook'),
        },
        {
          title: 'Discord',
          icon: <img src={iconDiscord} alt="discord" />,
          onClick: () => loginWithOpenLogin('discord'),
        },
        {
          title: 'Twitter',
          icon: <BsTwitter size={24} color="#00ACEE" />,
          onClick: () => loginWithOpenLogin('twitter'),
        },
        { title: 'Email', icon: <AiOutlineMail size={24} color="#fff" />, onClick: () => setShowEmailLogin(true) },
        { title: 'GitHub', icon: <BsGithub size={24} color="#000" />, onClick: () => loginWithOpenLogin('github') },
        { title: 'Twitch', icon: <img src={iconTwitch} alt="twitch" />, onClick: () => loginWithOpenLogin('twitch') },
      ],
      web3: [
        ...connectors.map((connector) => ({
          title: connector.name,
          icon: iconById[connector.id],
          onClick: () => connect({ connector }),
        })),
      ],
    };

    const selectedSignInOptions = showSocialLogins ? signInOptions.social : signInOptions.web3;
    if (showMoreOptions) return selectedSignInOptions;

    const visibleNumber = showSocialLogins ? 6 : 3;

    return selectedSignInOptions.slice(0, visibleNumber);
  }, [showSocialLogins, showMoreOptions, loginWithOpenLogin, connectors, connect]);

  if (isSigningIn) {
    return (
      <Wrapper>
        <WrapperTitle>Signing in</WrapperTitle>
        <LoadingBarWrapper>
          <LoadingBar />
        </LoadingBarWrapper>
        <WrapperText textAlign="left">⏱ This may take a minute or so please don’t close this window.</WrapperText>
      </Wrapper>
    );
  }

  if (!web3Auth) {
    return (
      <Wrapper>
        <WrapperTitle>Loading</WrapperTitle>
        <LoadingBarWrapper>
          <LoadingBar />
        </LoadingBarWrapper>
      </Wrapper>
    );
  }

  if (showEmailLogin) {
    return (
      <Wrapper>
        <WrapperTitle>Sign in with Email</WrapperTitle>
        <EmailInput placeholder="Enter you email" onChange={(e) => setEmail(e?.target?.value ?? '')} />
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <EmailSubmitButton
          onClick={() => loginWithOpenLogin('email_passwordless', email ?? undefined)}
          disabled={!email}
        >
          Sign in
        </EmailSubmitButton>
        <WrapperTextClickable
          onClick={() => {
            setShowEmailLogin(false);
            setEmail('');
            setErrorMessage(null);
          }}
        >
          Go back
        </WrapperTextClickable>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <WrapperTitle>Sign in</WrapperTitle>
      <>
        {!includeMM && !includeWC && (
          <SwitchWrapper>
            <SwitchOption isActive={showSocialLogins} onClick={() => setShowSocialLogins(true)}>
              Social
            </SwitchOption>
            <SwitchOption isActive={!showSocialLogins} onClick={() => setShowSocialLogins(false)}>
              Web3
            </SwitchOption>
          </SwitchWrapper>
        )}
        <SignInOptionsWrapper>
          {visibleSignInOptions.map((signInOption) => (
            <SignInOptionWrapper
              key={signInOption.title}
              onClick={isSigningIn ? undefined : signInOption.onClick}
              half={showSocialLogins}
            >
              <SignInOption disabled={isSigningIn}>
                <SignInOptionIcon>{signInOption.icon}</SignInOptionIcon>
                <span>{signInOption.title}</span>
              </SignInOption>
            </SignInOptionWrapper>
          ))}
        </SignInOptionsWrapper>
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        {!includeMM && !includeWC && (
          <WrapperTextClickable
            onClick={() => {
              setShowMoreOptions(!showMoreOptions);
            }}
          >
            Show {showMoreOptions ? 'less' : 'more'} options
          </WrapperTextClickable>
        )}
      </>
    </Wrapper>
  );
};

export default SignIn;
