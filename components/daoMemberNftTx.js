import { useWriteContract, useAccount, useSwitchChain } from 'wagmi';
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
const tokenAmount = ethers.utils.parseUnits('10', 18);

const DaoMemberNftTx = ({ onLogout }) => {
  const [isUsingPolygon, setIsUsingPolygon] = useState(true);
  const [isUsingWalletConnect, setIsUsingWalletConnect] = useState(false);
  const [showApproveMessage, setShowApproveMessage] = useState(false);
  const { address, chainId, connector, isConnected } = useAccount();
  const { switchChain, isLoading: isSwitching, error: switchError } = useSwitchChain();
  const [buttonText, setButtonText] = useState('Send Transaction');

  const handleApproveTxError = (error) => {
    console.log('Approve error', error);
  };

  const handleDepositTxError = (error) => {
    console.log('Deposit error', error);
  };

  const {
    writeContract: writeApprove,
    data: approveData,
    isSuccess: isApproveTxSuccess,
    isPending: isApproveTxPending,
    isError: isApproveTxError,
    error: approveError,
    status: approveStatus,
  } = useWriteContract();

  const handleWriteApprove = () => {
    try {
      writeApprove({
        abi: pillarTokenABI,
        address: tokenAddress,
        functionName: 'approve',
        args: [daoContractAddress, tokenAmount],
        onSuccess: () => {
          console.log('Approval successful');
          setShowApproveMessage(true);
        },
        onError: handleApproveTxError,
      });
    } catch (error) {
      console.error('Error in writeApprove:', error);
    }
  };

  const {
    writeContract: writeDeposit,
    data: depositData,
    isSuccess: isDepositTxSuccess,
    isPending: isDepositTxPending,
    isError: isDepositTxError,
    error: depositError,
    status: depositStatus,
  } = useWriteContract();

  const handleWriteDeposit = () => {
    try {
      writeDeposit({
        address: daoContractAddress,
        abi: pillarDaoNftABI,
        functionName: 'deposit',
        args: [tokenAmount],
        onSuccess: () => {},
        onError: handleDepositTxError,
      });
    } catch (error) {
      console.error('Error in writeDeposit:', error);
    }
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

  const isTxButtonDisabled = () => {
    return (
      isApproveTxPending || isDepositTxPending || (!isUsingPolygon && (!isDepositTxPending || !isApproveTxPending))
    );
  };

  useEffect(() => {
    console.error('Approve error', approveError?.message ?? '');
    console.error('Deposit error', depositError?.message ?? '');
  }, [depositError, approveError]);

  useEffect(() => {
    if (connector.type === 'walletConnect') {
      setIsUsingWalletConnect(true);
    }
  }, [connector]);

  useEffect(() => {
    setIsUsingPolygon(isConnected && chainId === polygonChainId);
  }, [chainId, isConnected]);

  useEffect(() => {
    function setTxButtonText() {
      if (isDepositTxPending || isApproveTxPending) {
        setButtonText('Sending');
      }
      if (isApproveTxSuccess && !isDepositTxPending) {
        setButtonText('Deposit');
      }
      if (!isApproveTxSuccess) {
        setButtonText('Approve PLR');
      } else {
        setButtonText('Send Transaction');
      }
    }
    setTxButtonText();
  }, [approveStatus, depositStatus]);

  let confetti = new Confetti('demo');

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
          disabled={isTxButtonDisabled()}
        >
          {isDepositTxSuccess && (
            <Checkmark>
              <FaCheck />
            </Checkmark>
          )}
          {buttonText}
        </TransactionButton>
        {showApproveMessage && (
          <>
            <div>Approval Transaction sent!</div>
            <a href={`https://polygonscan.com/tx/${approveData?.hash}`}>View On PolygonScan</a>
          </>
        )}
        {isDepositTxSuccess && (
          <>
            <div id="confetti"></div>
            <div>Transaction sent!</div>
            <a href={`https://polygonscan.com/tx/${depositData?.hash}`}>View On PolygonScan</a>
          </>
        )}
        {(isDepositTxError || isApproveTxError) && <div>Something went wrong</div>}
      </ButtonWrapper>
      <RestartButton title="Logout and Restart" disabled={isApproveTxPending || isDepositTxPending} onClick={onLogout}>
        <IoLogOutOutline />
      </RestartButton>
    </Wrapper>
  );
};

export default DaoMemberNftTx;
