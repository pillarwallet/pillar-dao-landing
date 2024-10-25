import { useWriteContract, useAccount, useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';
import pillarDaoNftABI from '../data/abis/pillarDaoNft.json';
import pillarTokenABI from '../data/abis/pillarToken.json';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoLogOutOutline } from 'react-icons/io5';

const RestartButton = styled.button`
  cursor: pointer;
  margin: 0.5rem;
  padding: 0.25rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background: #890df8;
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
    opacity: 0.7;
  }
`;

const polygonChainId = 137;
const daoContractAddress = '0xc380f15Db7be87441d0723F19fBb440AEaa734aB';
const tokenAddress = '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774';
const tokenAmount = ethers.utils.parseUnits('10000', 18);

const DaoMemberNftTx = ({ onLogout }) => {
  const [isUsingPolygon, setIsUsingPolygon] = useState(true);
  const { address, chainId, isConnected } = useAccount();
  const { switchChain, isLoading: isSwitching, error: switchError } = useSwitchChain();

  const handleApproveError = (error) => {
    console.log('Approve error', error);
  };

  const handleDepositError = (error) => {
    console.log('Deposit error', error);
  };

  const {
    writeContract: writeApprove,
    data: approveData,
    isSuccess: isApproveTxSuccess,
    isPending: isApproveTxPending,
    isError: isApproveTxError,
    error: approveError,
  } = useWriteContract();

  const handleWriteApprove = () => {
    try {
      writeApprove({
        abi: pillarTokenABI,
        address: tokenAddress,
        functionName: 'approve',
        args: [daoContractAddress, tokenAmount],
        onSuccess: () => {
          console.log('Approval successful, initiating deposit');
          handleWriteDeposit();
        },
        onError: handleApproveError,
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
  } = useWriteContract();

  const handleWriteDeposit = () => {
    try {
      writeDeposit({
        address: daoContractAddress,
        abi: pillarDaoNftABI,
        functionName: 'deposit',
        args: [tokenAmount],
        onSuccess: () => {},
        onError: handleDepositError,
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

  // useEffect(() => {
  //   console.error('Approve error', approveError?.message ?? '');
  //   console.error('Deposit error', depositError?.message ?? '');
  // }, [depositError, approveError]);

  useEffect(() => {
    setIsUsingPolygon(isConnected && chainId === polygonChainId);
  }, [chainId, isConnected]);

  const isTxButtonDisabled = () => {
    return (
      isApproveTxPending || isDepositTxPending || (!isUsingPolygon && (!isDepositTxPending || !isApproveTxPending))
    );
  };

  return (
    <>
      <div>
        <div>
          <button disabled={isUsingPolygon} onClick={() => switchChain({ chainId: polygonChainId })}>
            {isUsingPolygon && <span>✅</span>} Switch to Polygon
          </button>
        </div>
        <button
          style={{ display: 'flex', justifyContent: 'center' }}
          onClick={handleTransaction}
          disabled={isTxButtonDisabled()}
        >
          {isDepositTxPending || isApproveTxPending ? 'Sending...' : 'Send Transaction'}
        </button>

        {(isDepositTxSuccess || isApproveTxSuccess) && (
          <div>Transaction sent! Hash: {depositData?.hash ?? approveData?.hash}</div>
        )}
        {(isDepositTxError || isApproveTxError) && <div>Something went wrong</div>}
      </div>

      <RestartButton title="Logout and Restart" disabled={isApproveTxPending || isDepositTxPending} onClick={onLogout}>
        <IoLogOutOutline />
      </RestartButton>
    </>
  );
};

export default DaoMemberNftTx;
