import { useReadContract, useAccount } from 'wagmi';
import pillarDaoNftABI from '../data/abis/pillarDaoNftStake.json';
import styled from 'styled-components';

//#region Styled

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
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  text-align: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const WrapperTitle = styled.h1`
  color: #78e8f6;
  font-size: 1.25rem;
  margin-bottom: 1rem;
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

  return (
    <Wrapper>
      <WrapperTitle>Welcome, Pillar DAO member</WrapperTitle>
      <div id="memberSince">
        <Address>{walletAddress}</Address>
        <Info>Member since: {membershipDateUTC?.toString()}</Info>
        <Info>NFT: {memberId}</Info>
        <Info>Locked-in: {amountStaked} PLR</Info>
      </div>
    </Wrapper>
  );
};

export default MemberInfo;
