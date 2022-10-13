import styled from 'styled-components';
import { useMemo, useState } from 'react';

import { colors, fonts } from '../utils/theme';
import useWeb3 from '../hooks/web3';

import useStake from '../hooks/stake';
import { formatNumber } from '../utils/common';

import heroBackground from '../assets/images/hero-bg.png';
import stakeBackground from '../assets/images/stake-bg.png';
import terminateBackground from '../assets/images/terminate-bg.png';
import polygonIcon from '../assets/images/polygon-icon.png';

const OuterWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  padding: 100px 0;
  background: linear-gradient(180deg, #6D00A0 0%, #000000 100%);

  @media (max-width: 700px) {
    padding: 100px 30px 80px;
    height: auto;
    display: block;
  }
`;

const InnerWrapper = styled.div`
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  position: relative;

  @media (max-width: 700px) {
    height: auto;
    display: block;
  }
`;

const HeroRight = styled.div`
  position: relative;
  background-image: url('${heroBackground}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  padding: 150px 20px 150px 20px;
  margin-top: 100px;
  position: relative;
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(108, 1, 159, 0.5);
    filter: blur(100px);
    border-radius: 50%;
  }

  @media (max-width: 700px) {
    margin-top: 20px;
  }
`;

const HeroImage = styled.img`
  height: 100%;
  box-shadow: 1px 2px 34px 12px rgba(0,0,0,0.15);
  border-radius: 0.5rem;

  @media (max-width: 700px) {
    height: auto;
    width: 100%;
  }
`;

const Title = styled.h1`
  position: relative;
  font-size: 65px;
  line-height: 1.1;
  color: #fff;
  text-align: center;
  max-width: 25ch;
  font-weight: 600;
  margin: 0 auto;

  @media (max-width: 700px) {
    font-size: 40px;
    line-height: 50px;
    left: 0;
    top: 0;
    
    & > br {
      display: none;
    }
  }
`;

const SecondaryTitle = styled.h3`
  position: relative;
  font-size: 32px;
  line-height: 40px;
  color: #fff;
  max-width: ${({ maxWidth }) => maxWidth ?? 10}ch;
  margin-top: ${({ marginTop }) => marginTop ?? 0}px;

  @media (max-width: 700px) {
    font-size: 40px;
    line-height: 50px;
    left: 0;
    top: 0;
    
    & > br {
      display: none;
    }
  }
`;

const Paragraph = styled.p`
  font-family: ${fonts.secondary};
  font-size: 48px;
  color: #fff;
  max-width: ${({ maxWidth }) => maxWidth ?? 22}ch;
  font-weight: 300;
  ${({ center }) => center && `text-align: center;`}
  ${({ marginCenter }) => marginCenter && `margin: 0 auto;`}
  margin-top: ${({ marginTop }) => marginTop ?? 20}px;
  position: relative;
  
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

const ParagraphList = styled(Paragraph)`
  & > li {
    margin-bottom: 5px;
  }
`;

const ConnectedAddressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const InputActionWrapper = styled.div`
  display: flex;
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop ?? 20}px;`}
  margin-bottom: ${({ marginBottom }) => marginBottom ?? 15}px;
`;

const MintWrapper = styled.div`
  position: relative;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;


  @media (max-width: 700px) {
    margin: 20px auto 0;
  }
`;

const QuantityInput = styled.input`
  width: ${({ width }) => width ?? 70}px;
  margin-top: 2.5px;
  height: 45px;
  padding: 0 10px;
  font-size: 20px;
  box-shadow: 1px 2px 34px 12px rgba(0,0,0,0.15);
  border: none;
  font-family: ${fonts.secondary};
  text-align: right;
  margin-right: 20px;
  color: ${colors.dark};

  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button {
    margin-left: 5px;
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`;

const MintedText = styled.p`
  text-align: center;
  font-size: 18px;
  font-family: ${fonts.secondary};
`;

const ConnectedAddress = styled.p`
  font-family: ${fonts.secondary};
  font-size: 15px;
`;

const ConnectedMembership = styled.p`
  font-family: ${fonts.secondary};
  font-size: 40px;
  font-weight: 600;
`;

const NFTImage = styled.img`
  margin-left: 20px;
  height: 100px;
  width: 100px;
  // box-shadow: 1px 2px 34px 12px rgba(0,0,0,0.15);
  border-radius: 0.5rem;

  @media (max-width: 700px) {
    height: auto;
    width: 100%;
  }
`;

const ConnectedMembershipWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ActionDetailsText = styled.p`
  margin-top: ${({ marginTop }) => marginTop ?? 5}px;
  font-size: 15px;
  ${({ center }) => center && `text-align: center;`}
  font-family: ${fonts.secondary};
`;

const ActionButton = styled.div`
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

const HeroBottomWrapper = styled.div`
  margin-top: 90px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1164px;
  background: rgba(43, 1, 64, 0.5);
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(3px);
  border-radius: 30px;
  padding: 35px 35px 15px 35px;
  justify-content: space-between;
  
  
  & > div {
    width: 49%;
    background: rgba(43, 1, 64, 0.7);
    backdrop-filter: blur(3px);
    border-radius: 30px;
    padding: 30px 35px;
    position: relative;
  }
  
  
  & > div:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 30px;
    padding: 1px;
    background: linear-gradient(90deg, rgba(2,253,255,1) 0%, rgba(255,0,245,1) 100%);
    -webkit-mask: linear-gradient(#ffffff 0 0) content-box,
        linear-gradient(#ffffff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  
  
  & > div > img {
    position: absolute;
    top: 10px;
    right: -25px;
    width: 42%;
  }
  
  & > div > p {
    font-size: 16px;
    opacity: 0.6;
  }
  
  & > div > div {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 20px;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  & > div > div > p {
    font-size: 25px;
  }
  
  & > div > div > p strong {
    color: #FFFFFF;
  }
  
  & > div > div > p strong span {
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 100px;
    padding: 10px 30px;
    margin-right: 10px
  }

  @media (max-width: 700px) {
    display: block;

    & > div {
      width: auto;
      margin-bottom: 50px;
    }
  }
  
  & > div:last-child {
    width: 100%;
    background: transparent;
    backdrop-filter: none;
    border-radius: 0;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
  }
  
  & > div:last-child:before {
    content: none;
  }
  
  & > div:last-child > div {
    border-top: none;
    margin-top: 20px;
    padding-top: 0;
    padding-left: 50px;
    display: flex;
    justify-content: space-between;
    background: #8000FF;
    box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.25);
    border-radius: 35px;
    color: #FFFFFF;
    position: relative;
  }
  
  & > div:last-child > div:before {
    content: "";
    position: absolute;
    top: 0;
    left: 5px;
    width: 50px;
    height: 50px;
    background-image: url('${polygonIcon}');
    background-size: 150%;
    background-position: center center;
    background-repeat: no-repeat;
    
  }
`

const Hero = () => {
  const [mintAmount, setMintAmount] = useState(2);

  const {
    connect,
    reset,
    isConnecting,
    connectedAddress,
  } = useWeb3();

  const {
    balanceAvailable,
    isStaked,
    isApprovedForStaking,
    approveForStaking,
    isApproving,
    isStaking,
    isUnstaking,
    stake,
    unstake,
    isUnstakeAvailable,
    requiredStakeAmount,
    membershipId,
    tokenImageUrl,
  } = useStake();

  const connectDisabled = !!(isConnecting || connectedAddress);
  const onConnectClick = () => {
    if (connectDisabled) return;
    connect();
  };

  const balanceLoading = balanceAvailable === null;
  const hasEnoughBalanceAvailable = balanceAvailable !== null && balanceAvailable >= requiredStakeAmount;

  const stakingDisabled = !hasEnoughBalanceAvailable || isApproving || isStaking || isStaked;
  const onStakingApproveClick = () => {
    if (stakingDisabled) return;
    approveForStaking();
  };

  const onStakeClick = () => {
    if (stakingDisabled) return;
    stake();
  };

  const unstakingDisabled = !isStaked || isStaking || !isUnstakeAvailable || isUnstaking;
  const onUnstakeClick = () => {
    if (unstakingDisabled) return;
    unstake();
  };

  return (
    <OuterWrapper>
      <InnerWrapper>
        <HeroRight>
          <Title>
            PillarDAO Governor Portal Own your life.
          </Title>
          <Paragraph center marginCenter marginTop={40}>Now is the time to stand up and be an integral part of something spectacular</Paragraph>
        </HeroRight>
      </InnerWrapper>
      <HeroBottomWrapper>
        <div>
          <SecondaryTitle>Governor Stake</SecondaryTitle>
          <img src={stakeBackground} alt="Governor Stake" title="Governor Stake" />
          <Paragraph marginTop={20} maxWidth={25}>Stake 10k PLR tokens on Polygon Network to become a governor of PillarDAO and own your future</Paragraph>
          <div>
            <Paragraph marginTop={0}>Your balance: </Paragraph>
            <Paragraph marginTop={0}>{connectedAddress && balanceLoading ? 'Loading...' : <strong><span>{formatNumber(balanceAvailable)}</span> PLR</strong>}</Paragraph>
          </div>
          <InputActionWrapper marginTop={20}>
            {!isApprovedForStaking && (
              <ActionButton
                onClick={onStakingApproveClick}
                disabled={stakingDisabled}
              >
                {hasEnoughBalanceAvailable && (isApproving ? `Approving...` : `Approve ${requiredStakeAmount} $PLR for staking`)}
                {!hasEnoughBalanceAvailable && `Not enough $PLR`}
              </ActionButton>
            )}
            {isApprovedForStaking && (
              <ActionButton
                onClick={onStakeClick}
                disabled={stakingDisabled}
              >
                {!isStaked && (isStaking ? `Staking...` : `Stake ${requiredStakeAmount} $PLR`)}
                {isStaked && `Already staked`}
              </ActionButton>
            )}
          </InputActionWrapper>
        </div>
        <div>
          <SecondaryTitle>Terminate Governorship</SecondaryTitle>
          <img src={terminateBackground} alt="Terminate Governorship" title="Terminate Governorship" />
          <Paragraph marginTop={20} maxWidth={25}>After a lock in of 52 weeks, you are eligible to terminate your membership</Paragraph>
          <div>
            <Paragraph marginTop={0}>Your staked balance: </Paragraph>
            <Paragraph marginTop={0}><strong><span>{isStaked ? requiredStakeAmount : 0}</span> PLR</strong></Paragraph>
          </div>
          <InputActionWrapper marginTop={20}>
            <ActionButton
              onClick={onUnstakeClick}
              disabled={unstakingDisabled}
            >
              {isStaked && (isUnstaking ? `Unstaking...` : `Unstake ${requiredStakeAmount} $PLR`)}
              {!isStaked && `Not staked`}
            </ActionButton>
          </InputActionWrapper>
        </div>
        <MintWrapper>
            {!connectedAddress && (
              <>
                <ActionButton disabled={connectDisabled} onClick={onConnectClick} marginBottom={20}>
                  {isConnecting ? `Connecting...` : `Connect Polygon Wallet`}
                </ActionButton>
              </>
            )}
            {!!connectedAddress && (
              <>
                <ConnectedAddressWrapper>
                  <ConnectedAddress>{connectedAddress}</ConnectedAddress>
                  <DisconnectButton onClick={reset}>Disconnect</DisconnectButton>
                </ConnectedAddressWrapper>
                { !!isStaked && (
                <ConnectedMembershipWrapper>
                  { !!membershipId && <ConnectedMembership>MEMBERSHIP ID: {membershipId} </ConnectedMembership>}
                  { !!tokenImageUrl && <NFTImage src={tokenImageUrl} />}
                </ConnectedMembershipWrapper>
                )}
              </>
            )}
          </MintWrapper>
      </HeroBottomWrapper>
    </OuterWrapper>
  )
};

export default Hero;
