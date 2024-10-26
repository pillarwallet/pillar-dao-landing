import { useWriteContract, useReadContract, useAccount, useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';
import pillarDaoNftABI from '../data/abis/pillarDaoNft.json';
import pillarTokenABI from '../data/abis/pillarToken.json';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoLogOutOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

//#region Styled

const Checkmark = styled.div`
  margin-right: 0.5rem;
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
  user-select: none;
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

  &:disabled {
    opacity: 0.5;
    background-color: #45006f;
    cursor: auto;
  }
  &:hover {
    background-color: #45005f;
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

/* 
Mainnet (verify)
Polygon token: 0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774
dao contract: 0xc380f15Db7be87441d0723F19fBb440AEaa734aB

Polygon Amoy test contracts:
(test nft: 0x0901f5aBd34A9080Dded6dad72188aAbee8a976F)
test tokens: 0x3cb29AAC77693A0784380Fb664Ec443Ce1079882
test dao contract: 0xf1a8685519D456f47a9F3505035F4Bad5d9a9ce0
required test stake amount: 10 * 10**18 = 10000000000000000000
required test stake time: 0.1 min
*/

const polygonChainId = 80002; //80002 amoy testnet, 137 polygon mainnet
const daoContractAddress = '0xf1a8685519d456f47a9f3505035f4bad5d9a9ce0';
const tokenAddress = '0x3cb29aac77693a0784380fb664ec443ce1079882';
const stakeTokenAmount = ethers.utils.parseUnits('10', 18);
const explorer = `https://polygonscan.com/tx/`;

const DaoMemberNftTx = ({ onLogout }) => {
  const [isUsingPolygon, setIsUsingPolygon] = useState(true);
  const [isUsingWalletConnect, setIsUsingWalletConnect] = useState(false);
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [approveTxData, setApproveTxData] = useState('');
  const [depositTxData, setDepositTxData] = useState('');
  const { address, chainId, connector, isConnected } = useAccount();
  const { switchChain, isLoading: isSwitching, error: switchError } = useSwitchChain();
  const [buttonText, setButtonText] = useState('Send Transaction');

  const handleApproveTxError = (error) => {
    console.log('Approve error', error);
  };

  const handleDepositTxError = (error) => {
    console.log('Deposit error', error);
  };

  console.log(address);

  const { data: membershipIdData, error } = useReadContract({
    pillarDaoNftABI,
    address: daoContractAddress,
    args: [address],
    functionName: 'membershipId',
    chainId: polygonChainId,
    query: {
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
    },
  });
  const membershipId = membershipIdData;
  const isAlreadyMember = Number(membershipId) > 0 ? true : false;

  useEffect(() => {
    console.log(error);
    console.log(membershipId, 'member?', address);
    console.log('isAlreadyMember', isAlreadyMember);
  });

  const {
    writeContract: writeApprove,
    isSuccess: isApproveTxSuccess,
    isPending: isApproveTxPending,
    isError: isApproveTxError,
    error: approveError,
    status: approveStatus,
  } = useWriteContract({
    //onError = ()=>{console.log('there was an error')}
  });

  const handleWriteApprove = () => {
    writeApprove(
      {
        functionName: 'approve',
        args: [daoContractAddress, stakeTokenAmount],
        abi: pillarTokenABI,
        address: tokenAddress,
      },
      {
        onSuccess: (data) => {
          console.log('Approval successful:', data);
          setApproveTxData(data);
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
        address: daoContractAddress,
        abi: pillarDaoNftABI,
        functionName: 'deposit',
        args: [stakeTokenAmount],
        onSuccess: () => {},
        onError: handleDepositTxError,
      },
      {
        onSuccess: (data) => {
          console.log('Deposit successful:', data);
          setDepositTxData(data);
          setShowDepositMessage(true);
        },
        onError: (error) => {
          console.error('Deposit failed:', error);
        },
      },
    );
  };

  const handleTransaction = () => {
    if (isApproveTxSuccess) {
      console.log('Proceeding with deposit');
      handleWriteDeposit();
    } else {
      console.log('Initiating approval');
      handleWriteApprove();
    }
  };

  // useEffect(() => {
  //   console.error('Approve error', approveError?.message ?? '');
  //   console.error('Deposit error', depositError?.shortMessage ?? '');
  // }, [depositError, approveError]);

  useEffect(() => {
    if (connector.type === 'walletConnect') {
      setIsUsingWalletConnect(true);
    }
  }, [connector]);

  useEffect(() => {
    setIsUsingPolygon(isConnected && chainId === polygonChainId);
  }, [chainId, isConnected]);

  useEffect(() => {
    function changeButton() {
      console.log('approveStatus', approveStatus);
      console.log('depositStatus', depositStatus);
      if (!isUsingPolygon) {
        setButtonEnabled(false);
      } else {
        if (approveStatus === 'idle' || approveStatus === 'error') {
          setButtonText('Approve PLR');
          setButtonEnabled(true);
        }
        if (approveError?.shortMessage) {
          setErrorText(approveError.shortMessage);
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
        if (depositError?.shortMessage) {
          setErrorText(depositError.shortMessage);
        }
        if (depositStatus === 'success') {
          setButtonText('Deposit Sent');
          setButtonEnabled(false);
        }
      }
    }
    changeButton();
  }, [approveStatus, depositStatus]);

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
        <TransactionButton
          id="sendTransaction"
          style={{ display: 'flex', justifyContent: 'center' }}
          onClick={handleTransaction}
          disabled={!isButtonEnabled}
        >
          {isDepositTxSuccess && (
            <Checkmark>
              <FaCheck />
            </Checkmark>
          )}
          {buttonText}
        </TransactionButton>
        {approveTxData.length > 1 && (
          <>
            <div>Approval Transaction sent!</div>
            <a href={`${explorer}${approveTxData}`}>View On Explorer</a>
          </>
        )}
        {depositTxData.length > 1 && (
          <>
            <div>Transaction sent!</div>
            <a href={`${explorer}${depositTxData}`}>View On Explorer</a>
          </>
        )}
        {(isDepositTxError || isApproveTxError) && (
          <div id="errorMessage">
            <div>Something went wrong:</div>
            <div>{errorText}</div>
          </div>
        )}
      </ButtonWrapper>
      <RestartButton title="Logout and Restart" disabled={isApproveTxPending || isDepositTxPending} onClick={onLogout}>
        <IoLogOutOutline />
      </RestartButton>
    </Wrapper>
  );
};
export default DaoMemberNftTx;
