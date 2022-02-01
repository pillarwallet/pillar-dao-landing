import styled from 'styled-components';

import { colors, fonts } from '../utils/theme';
import useWeb3 from '../hooks/web3';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { verifyAndSubmit } from '../services/verify';
import { chainIdToNetworkTitle, formatNumber } from '../utils/common';
import { getPlrBalanceForAddress, getDefaultProvider } from '../services/contract';

const Wrapper = styled.div`
  padding: 100px 30px 80px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Paragraph = styled.p`
  font-family: ${fonts.secondary};
  font-size: 18px;
  color: #fff;
  margin-top: ${({ marginTop }) => marginTop ?? 20}px;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? 20}px;
  font-weight: 200;
  ${({ center }) => center && `text-align: center;`}
  
  & > strong {
    color: ${colors.yellow};
  }
  
  & > ul {
    padding-left: 20px;
  }

  @media (max-width: 700px) {
    font-size: 18px;
    line-height: 25px;
  }
`;

const ConnectedAddressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ConnectedAddress = styled.p`
  font-family: ${fonts.secondary};
  font-size: 15px;
`;

const ActionButton = styled.div`
  display: inline-block;
  background: ${({ disabled, color }) => disabled ? '#737373' : color ?? colors.yellow};
  color: #000;
  padding: 0 25px;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  font-family: ${fonts.secondary};
  border-radius: 0.5rem;
  line-height: 50px;
  box-shadow: 1px 2px 34px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom}px;`}

  ${({ disabled }) => !disabled && `
    &:hover {
      opacity: 0.7;
    }
  `}

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;
const RedirectNetworkButton = styled.a`
  &, &:visited {
    color: ${colors.yellow};
    text-decoration: none;
  }
  &:hover {
    opacity: 0.3;
  }
`;
const DisconnectButton = styled.div`
  color: ${colors.yellow};
  margin-left: 15px;
  cursor: pointer;

  &:hover {
    opacity: 0.3;
  }
  
  @media (max-width: 700px) {
    margin: 0;
  }
`;

const TextInput = styled.input`
  width: 300px;
  height: 45px;
  padding: 0 10px;
  font-size: 15px;
  box-shadow: 1px 2px 34px 12px rgba(0,0,0,0.15);
  border: none;
  font-family: ${fonts.secondary};
  text-align: left;
  color: ${colors.dark};

  &:focus {
    outline: none;
  }
`;

const TextInputWrapper = styled.div`
  text-align: center;
`;


const BalancesWrapper = styled.div`
  padding: 0 25px 5px;
  border-bottom: 3px solid #fff;
  margin-bottom: 50px;
  padding-bottom: 30px;
`;

const SubmitWrapper = styled.div`
  margin-top: 50px;
`;

const Hero = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessfulSubmit, setIsSuccessfulSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [v2WalletAddress, setV2WalletAddress] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [plrBalancePolygon, setPlrBalancePolygon] = useState(0);
  const [plrBalanceEthereumMainnet, setPlrBalanceEthereumMainnet] = useState(0);

  const {
    connect,
    reset,
    isConnecting,
    connectedAddress,
    connectedProvider,
    chainId,
  } = useWeb3();

  const connectDisabled = !!(isConnecting || connectedAddress);
  const onConnectClick = () => {
    if (connectDisabled) return;
    connect();
  };

  const updateBalances = useCallback(async () => {
    if (!connectedAddress) return;

    const newPlrBalancePolygon = await getPlrBalanceForAddress(connectedAddress, getDefaultProvider(137), 137);
    setPlrBalancePolygon(newPlrBalancePolygon);

    const newPlrBalanceEthereumMainnet = await getPlrBalanceForAddress(connectedAddress, getDefaultProvider(1), 1);
    setPlrBalanceEthereumMainnet(newPlrBalanceEthereumMainnet);
  }, [connectedAddress]);

  useEffect(() => { updateBalances(); }, [updateBalances]);

  const hasEnoughBalance = useMemo(() => {
    return plrBalanceEthereumMainnet >= +process.env.NEXT_PUBLIC_REQUIRED_PLR_AMOUNT_FOR_VERIFICATION
      || plrBalancePolygon >= +process.env.NEXT_PUBLIC_REQUIRED_PLR_AMOUNT_FOR_VERIFICATION;
  }, [plrBalanceEthereumMainnet, plrBalancePolygon]);

  const submitDisabled = useMemo(
    () => isSubmitting
      || !hasEnoughBalance
      || !v2WalletAddress?.length
      || !discordUsername?.length,
    [isSubmitting, hasEnoughBalance, discordUsername, v2WalletAddress],
  );

  const onSubmit = useCallback(async () => {
    if (submitDisabled) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await verifyAndSubmit(connectedProvider, {
      v2WalletAddress,
      discordUsername,
      governorWalletAddress: connectedAddress,
    });

    if (!result?.success) {
      setErrorMessage(result?.errorMessage ?? 'Unknown error occurred!');
    } else {
      setIsSuccessfulSubmit(true);
    }

    setIsSubmitting(false);
  }, [v2WalletAddress, discordUsername, connectedAddress, connectedProvider, submitDisabled]);

  const inputDisabled = isSubmitting
    || isSuccessfulSubmit
    || !hasEnoughBalance;

  const switchToChainId = chainId === 1 ? 137 : 1;

  return (
    <Wrapper>
      {!connectedAddress && (
        <>
          <Paragraph marginTop={0}>Connect with your <strong>governor role wallet</strong> to proceed.</Paragraph>
          <ActionButton disabled={connectDisabled} onClick={onConnectClick} marginBottom={20}>
            {isConnecting ? `Connecting...` : `Connect wallet on ${chainIdToNetworkTitle[chainId]}`}
          </ActionButton>
          <RedirectNetworkButton href={`/verify${chainId === 1 ? '-polygon' : ''}`}>Switch to {chainIdToNetworkTitle[switchToChainId]}</RedirectNetworkButton>
        </>
      )}
      {!!connectedAddress && (
        <>
          <ConnectedAddressWrapper>
            <ConnectedAddress>Connected: {connectedAddress}</ConnectedAddress>
            <DisconnectButton onClick={reset}>Disconnect</DisconnectButton>
          </ConnectedAddressWrapper>
          <BalancesWrapper>
            <Paragraph>Balance on Ethereum Mainnet: <strong>{formatNumber(plrBalanceEthereumMainnet)} $PLR</strong></Paragraph>
            <Paragraph marginBottom={0}>Balance on Polygon: <strong>{formatNumber(plrBalancePolygon)} $PLR</strong></Paragraph>
          </BalancesWrapper>
          <TextInputWrapper>
            <Paragraph marginBottom={10}>Pillar V2 wallet address to claim NFT:</Paragraph>
            <TextInput
              disabled={inputDisabled}
              value={v2WalletAddress}
              onChange={(value) => setV2WalletAddress(value?.target?.value || '')}
              placeholder="0x..."
            />
          </TextInputWrapper>
          <TextInputWrapper>
            <Paragraph marginBottom={10}>Pillar Discord username:</Paragraph>
            <TextInput
              disabled={inputDisabled}
              value={discordUsername}
              onChange={(value) => setDiscordUsername(value?.target?.value || '')}
              placeholder="Username"
            />
          </TextInputWrapper>
          {isSuccessfulSubmit && <Paragraph marginTop={60}>Successfully submitted!</Paragraph>}
          {!isSuccessfulSubmit && (
            <SubmitWrapper>
              {!hasEnoughBalance && (
                <>
                  <Paragraph marginBottom={0} a>Not enough $PLR for <strong>governor role</strong>.</Paragraph>
                  <Paragraph marginTop={10}><strong>{formatNumber(process.env.NEXT_PUBLIC_REQUIRED_PLR_AMOUNT_FOR_VERIFICATION)} $PLR</strong> is required on either Polygon or Ethereum Mainnet!</Paragraph>
                </>
              )}
              {!!errorMessage && <Paragraph><u>{errorMessage}</u></Paragraph>}
              <ActionButton onClick={onSubmit} disabled={submitDisabled}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </ActionButton>
            </SubmitWrapper>
          )}
        </>
      )}
    </Wrapper>
  )
};

export default Hero;
