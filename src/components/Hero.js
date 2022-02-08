import styled from 'styled-components';
import { useMemo, useState } from 'react';

import { colors, fonts } from '../utils/theme';
import useWeb3 from '../hooks/web3';

import useStake from '../hooks/stake';
import { formatNumber } from '../utils/common';

const OuterWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  padding: 100px 0;

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
  padding-left: 40px;

  @media (max-width: 700px) {
    padding-left: 0;
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
  font-size: 50px;
  line-height: 60px;
  color: #fff;

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
  font-size: 30px;
  line-height: 40px;
  color: #fff;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 3px solid #fff;

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
  font-size: 18px;
  color: #fff;
  margin-top: ${({ marginTop }) => marginTop ?? 20}px;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  
  & > div {
    width: 29%;
  }

  @media (max-width: 700px) {
    display: block;

    & > div {
      width: auto;
      margin-bottom: 50px;
    }
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
    console.log('stakingDisabled', stakingDisabled);
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
            Pillar DAO MEMBERSHIP
          </Title>
          <Paragraph>Become a member of the Pillar DAO after staking 10,000 $PLR tokens(built on the Polygon Network).</Paragraph>
          <MintWrapper>
            {!connectedAddress && (
              <>
                <ActionButton disabled={connectDisabled} onClick={onConnectClick} marginBottom={20}>
                  {isConnecting ? `Connecting...` : `Connect wallet`}
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
        </HeroRight>
      </InnerWrapper>
      <HeroBottomWrapper>
        <div>
          <SecondaryTitle>Become a Member</SecondaryTitle>
          <Paragraph marginTop={0}>Stake your 10,000 $PLR tokens on Polygon and become a member.</Paragraph>
          <Paragraph marginTop={20}>Your balance: {connectedAddress && balanceLoading ? 'Loading...' : <strong>{formatNumber(balanceAvailable)} $PLR</strong>}</Paragraph>
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
          <SecondaryTitle>Terminate Membership</SecondaryTitle>
          <Paragraph marginTop={0}>After a lock-in of 52 weeks, you are eligible to terminate your membership.</Paragraph>
          <Paragraph marginTop={20}>Your staked balance: <strong>{isStaked ? requiredStakeAmount : 0} $PLR</strong></Paragraph>
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
      </HeroBottomWrapper>
    </OuterWrapper>
  )
};

export default Hero;
