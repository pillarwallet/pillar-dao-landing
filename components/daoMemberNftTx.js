import { useWriteContract, useReadContract, useAccount, useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';
import pillarDaoNftABI from '../data/abis/pillarDaoNftStake.json';
import pillarTokenABI from '../data/abis/pillarToken.json';
import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { IoLogOutOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';
import UnstakeButton from './unstakeButton';
import MemberInfo from './memberInfo';

/* 
---Mainnet (verify)---
Polygon PLR token: 0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774
Dao contract: 0xc380f15Db7be87441d0723F19fBb440AEaa734aB

---Polygon Amoy test contracts---
test dao contract: 0xf1a8685519D456f47a9F3505035F4Bad5d9a9ce0
test tokens (airdrop): 0x3cb29AAC77693A0784380Fb664Ec443Ce1079882
required test stake amount: 10*10**18 = 10000000000000000000 (10 tokens)
required test stake time: 0.1 min (6 seconds)
test nft: 0x0901f5aBd34A9080Dded6dad72188aAbee8a976F
*/

const polygonChainId = 137; //80002 amoy testnet, 137 polygon mainnet
const daoContractAddress = '0xc380f15Db7be87441d0723F19fBb440AEaa734aB';
const tokenAddress = '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774';
const stakeTokenAmount = ethers.utils.parseUnits('10', 18);
const explorer = `https://polygonscan.com/tx/`;

const DaoMemberNftTx = ({ onLogout }) => {
  const [isUsingPolygon, setIsUsingPolygon] = useState(true);
  const [isUsingWalletConnect, setIsUsingWalletConnect] = useState(false);
  const [approveTxData, setApproveTxData] = useState('');
  const [depositTxData, setDepositTxData] = useState('');
  const { address, chainId, connector, isConnected, status: accountStatus } = useAccount();
  const { switchChain, isLoading: isSwitching } = useSwitchChain();
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const [buttonText, setButtonText] = useState('Send Transaction');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setIsUsingPolygon(chainId === polygonChainId);
  }, [accountStatus, chainId]);

  const { data: membershipTimeData } = useReadContract({
    abi: pillarDaoNftABI,
    address: daoContractAddress,
    args: [address],
    functionName: 'viewDepositTimestamp',
    chainId: chainId,
    query: {
      refetchOnWindowFocus: true,
    },
  });
  const membershipTime = Number(membershipTimeData);

  const shouldShowUnstakeButton = useMemo(() => {
    if (!membershipTime || membershipTime === 0) return false;
    const currentTimeInSeconds = Date.now() / 1000;
    return currentTimeInSeconds > membershipTime + 180;
  }, [membershipTime]);

  //if user is already member, show member panel and unstake button
  const { data: membershipIdData } = useReadContract({
    abi: pillarDaoNftABI,
    address: daoContractAddress,
    args: [address],
    functionName: 'membershipId',
    chainId: polygonChainId,
    query: {
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
    },
  });
  const membershipId = Number(membershipIdData);

  useEffect(() => {
    function isDAOMember() {
      if (membershipId > 0) {
        setIsAlreadyMember(true);
      } else {
        setIsAlreadyMember(false);
      }
    }
    isDAOMember();
  }, [isConnected, accountStatus, address, membershipIdData]);

  const {
    writeContract: writeApprove,
    isSuccess: isApproveTxSuccess,
    isPending: isApproveTxPending,
    isError: isApproveTxError,
    error: approveError,
    status: approveStatus,
  } = useWriteContract({});

  const handleWriteApprove = () => {
    writeApprove(
      {
        functionName: 'approve',
        abi: pillarTokenABI,
        address: tokenAddress,
        args: [daoContractAddress, stakeTokenAmount],
      },
      {
        onSuccess: (data) => {
          setApproveTxData(data);
          console.log('Approval successful:', data);
        },
        onError: (error) => {
          console.error('Approval failed:', error);
        },
      },
    );
  };

  const {
    writeContract: writeDeposit,
    isSuccess: isDepositTxSuccess,
    isPending: isDepositTxPending,
    isError: isDepositTxError,
    error: depositError,
    status: depositStatus,
  } = useWriteContract();

  const handleWriteDeposit = () => {
    writeDeposit(
      {
        functionName: 'deposit',
        abi: pillarDaoNftABI,
        address: daoContractAddress,
        args: [stakeTokenAmount],
      },
      {
        onSuccess: (data) => {
          setDepositTxData(data);
          console.log('Deposit successful:', data);
        },
        onError: (error) => {
          console.error('Deposit failed:', error);
        },
      },
    );
  };

  const handleTransaction = () => {
    setErrorText('');
    if (isApproveTxSuccess) {
      handleWriteDeposit();
    } else {
      handleWriteApprove();
    }
  };

  useEffect(() => {
    if (connector.type === 'walletConnect') {
      setIsUsingWalletConnect(true);
    }
  }, [connector]);

  useEffect(() => {
    function changeErrorText() {
      if (approveError?.shortMessage) {
        setErrorText(approveError.shortMessage);
      }
      if (depositError?.shortMessage) {
        setErrorText(depositError.shortMessage);
      }
    }
    function changeButton() {
      if (!isUsingPolygon) {
        setButtonEnabled(false);
      } else {
        if (approveStatus === 'idle' || approveStatus === 'error') {
          setButtonText('Approve PLR');
          setButtonEnabled(true);
        }
        if (approveStatus === 'pending') {
          setButtonText('Approval Pending');
          setButtonEnabled(false);
        }
        if (approveStatus === 'success') {
          setButtonText('Deposit');
          setButtonEnabled(true);
        }
        if (depositStatus === 'pending') {
          setButtonText('Deposit Pending');
          setButtonEnabled(false);
        }
        if (depositStatus === 'success') {
          setButtonText('Deposit Sent');
          setButtonEnabled(false);
        }
      }
    }
    changeButton();
    changeErrorText();
  }, [approveStatus, depositStatus, isUsingPolygon]);

  return (
    <Wrapper>
      <WrapperTitle>Send Transaction on Polygon</WrapperTitle>
      <ButtonWrapper>
        <TransactionButton
          id="switchToPolygonNetwork"
          disabled={isUsingPolygon || isSwitching || isUsingWalletConnect}
          onClick={() => switchChain({ chainId: polygonChainId })}
        >
          {isUsingPolygon && (
            <Checkmark>
              <FaCheck />
            </Checkmark>
          )}
          Use Polygon
        </TransactionButton>
        <TransactionButton id="sendTransaction" onClick={handleTransaction} disabled={!isButtonEnabled}>
          {isDepositTxSuccess && (
            <Checkmark>
              <FaCheck />
            </Checkmark>
          )}
          {buttonText}
        </TransactionButton>

        {approveTxData.length > 1 && (
          <TxInfo id="approvalInfo">
            <div>Approval Transaction sent!</div>
            <a href={`${explorer}${approveTxData}`} target="_blank" rel="noopener nofollow noreferrer">
              View On Explorer
            </a>
          </TxInfo>
        )}
        {depositTxData.length > 1 && (
          <TxInfo id="depositInfo">
            <div>Deposit Transaction sent!</div>
            <a href={`${explorer}${depositTxData}`} target="_blank" rel="noopener nofollow noreferrer">
              View On Explorer
            </a>
          </TxInfo>
        )}
        {(isDepositTxError || isApproveTxError) && (
          <TxInfo>
            <div id="errorMessage">
              <div>Something went wrong:</div>
              <div>{errorText}</div>
            </div>
          </TxInfo>
        )}
        {isAlreadyMember && (
          <>
            <MemberInfo chainId={polygonChainId} contract={daoContractAddress}></MemberInfo>
          </>
        )}
        {isAlreadyMember && shouldShowUnstakeButton && (
          <>
            <UnstakeButton chainId={polygonChainId} contract={daoContractAddress} explorer={explorer}></UnstakeButton>
          </>
        )}
      </ButtonWrapper>
      <RestartButton title="Logout and Restart" disabled={isApproveTxPending || isDepositTxPending} onClick={onLogout}>
        <IoLogOutOutline />
      </RestartButton>
    </Wrapper>
  );
};

//#region Styled
const Checkmark = styled.div`
  margin-right: 0.5rem;
`;

const TxInfo = styled.div`
  width: 100%;
  max-width: 80%;
  padding: 0.875rem 1.25rem 1.25rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  text-align: center;
  justify-content: center;
  margin: 0.5rem;
  overflow-wrap: break-word;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 80%;
  padding: 0.875rem 1.25rem 1.625rem;
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
  margin-bottom: 1.875rem;
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

const RestartButton = styled.button`
  cursor: pointer;
  margin: 0.5rem;
  padding: 0.25rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background: #5c0088;
  font-family: 'PTRootUIWebRegular', sans-serif;
  text-align: center;
  color: #fff;
  max-height: 2rem;
  max-width: 2rem;
  font-size: 1rem;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover {
    background-color: #45005f;
    opacity: 0.7;
  }
`;

//#endregion Styled

export default DaoMemberNftTx;
