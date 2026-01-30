import { useReadContract, useAccount, useEnsName } from 'wagmi';
import pillarDaoNftABI from '../../data/abis/pillarDaoNftStake.json';
import styled, { keyframes } from 'styled-components';
import { useMemo } from 'react';

//#region Styled

const glowPulse = keyframes`
  0%, 100% {
    box-shadow:
      0 0 20px rgba(120, 232, 246, 0.4),
      0 0 40px rgba(120, 232, 246, 0.2),
      0 0 60px rgba(137, 13, 248, 0.3),
      inset 0 0 20px rgba(120, 232, 246, 0.1);
  }
  50% {
    box-shadow:
      0 0 30px rgba(120, 232, 246, 0.6),
      0 0 60px rgba(120, 232, 246, 0.3),
      0 0 80px rgba(137, 13, 248, 0.4),
      inset 0 0 30px rgba(120, 232, 246, 0.15);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const slideInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Checkmark = styled.div`
  margin-right: 0.5rem;
`;

const Address = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0.5rem 0;
  word-break: break-all;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0.5rem 0;
  overflow-wrap: break-word;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 80%;
  padding: 0.75rem 0.75rem 0.75rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.9);
  border: 2px solid #78e8f6;
  color: #fff;
  text-align: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  /* Celebration animations */
  animation:
    ${slideInUp} 0.6s ease-out,
    ${glowPulse} 3s ease-in-out infinite;

  /* Shimmer effect overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(120, 232, 246, 0.2),
      transparent
    );
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const WrapperTitle = styled.h1`
  color: #78e8f6;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 10px rgba(120, 232, 246, 0.5);
`;

const ButtonWrapper = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;

const TransactionButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Euclid Circular B', sans-serif;
  font-weight: 500;
  font-style: normal;
  color: #fff;
  font-size: 1rem;
  padding: 1.75rem 2.125rem;
  margin: 0.5rem;
  border-radius: 1.5rem;
  background-color: #5c0088;
  cursor: pointer;
  outline: 2px;
  width: 100%;
  max-width: 80%;

  &:hover {
    background-color: #45005f;
  }
  &:disabled {
    opacity: 0.5;
    background-color: #45006f;
    cursor: auto;
  }
`;

//#endregion Styled

const MemberInfo = ({ chainId, contract }) => {
  const { address: walletAddress } = useAccount();
  const { data: ensName } = useEnsName({ walletAddress });

  const { data: membershipTimeData } = useReadContract({
    abi: pillarDaoNftABI,
    address: contract,
    args: [walletAddress],
    functionName: 'viewDepositTimestamp',
    chainId: chainId,
    query: {
      refetchOnWindowFocus: true,
    },
  });
  const membershipTime = Number(membershipTimeData);
  const membershipDateUTC = new Date(membershipTime * 1000)?.toLocaleString();

  const { data: amountStakedData } = useReadContract({
    abi: pillarDaoNftABI,
    address: contract,
    args: [walletAddress],
    functionName: 'balanceOf',
    chainId: chainId,
    query: {
      refetchOnWindowFocus: true,
    },
  });
  const amountStaked = Number(amountStakedData) / 10 ** 18;

  const { data: membershipIdData } = useReadContract({
    abi: pillarDaoNftABI,
    address: contract,
    args: [walletAddress],
    functionName: 'membershipId',
    chainId: chainId,
    query: {
      refetchOnWindowFocus: true,
    },
  });

  const memberId = Number(membershipIdData);

  const formatAddress = useMemo(() => {
    if (!walletAddress) return null;
    return `${walletAddress.slice(0, 6)}…${walletAddress.slice(38, 42)}`;
  }, [walletAddress]);

  return (
    <Wrapper>
      <WrapperTitle>Welcome, Pillar DAO member</WrapperTitle>
      <div id="memberPanel" style={{ position: 'relative', zIndex: 1 }}>
        {ensName && <Info>{ensName}</Info>}
        {formatAddress && <Address>{formatAddress}</Address>}
        <Info>Member since: {membershipDateUTC?.toString()}</Info>
        <Info>NFT: {memberId}</Info>
        <Info>Locked-in: {amountStaked} PLR</Info>
      </div>
    </Wrapper>
  );
};

export default MemberInfo;
