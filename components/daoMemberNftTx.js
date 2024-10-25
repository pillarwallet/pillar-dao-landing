//0xb6b55f25

import { useWriteContract, useAccount, useSwitchChain } from 'wagmi';
import { ethers } from 'ethers';
import pillarDaoNftABI from '../data/abis/pillarDaoNft.json';
import pillarTokenABI from '../data/abis/pillarToken.json';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const RestartButton = styled.button`
  cursor: pointer;
  margin: 0.5rem;
  padding: 0.5rem 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px 0 rgba(95, 0, 1, 0.13);
  border: none;
  background: #890df8;
  font-family: 'PTRootUIWebRegular', sans-serif;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  max-width: 10%;
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

const DaoMemberNftTx = ({ onLogout }) => {
  const [isUsingPolygon, setIsUsingPolygon] = useState(true);
  const { address, chainId, connector, isConnected, status } = useAccount();
  const { chains, switchChain, isLoading: isSwitching, error: switchError } = useSwitchChain();

  const {
    writeContract: writeApprove,
    data: approveData,
    isSuccess: isApproveTxSuccess,
    isPending: isApproveTxPending,
    isError: isApproveTxError,
    error: approveError,
  } = useWriteContract();
  const {
    writeContract: writeDeposit,
    data: depositData,
    isSuccess: isDepositTxSuccess,
    isPending: isDepositTxPending,
    isError: isDepositTxError,
    error: depositError,
  } = useWriteContract();

  const amount = ethers.utils.parseUnits('10000', 18);

  const handleTransaction = () => {
    console.log('handleTx');
    if (isApproveTxSuccess) {
      //TODO: add logic to determine if approval already happened (e.g. user refreshes the page)
      handleWriteDeposit();
    } else {
      console.log('approval');
      handleWriteApprove();
    }
  };

  const handleWriteApprove = () => {
    try {
      writeApprove({
        abi: pillarTokenABI,
        address: tokenAddress,
        functionName: 'approve',
        args: [daoContractAddress, amount],
        onSuccess: () => {
          // After approval, proceed to deposit
          handleWriteDeposit();
        },
      });
    } catch (error) {
      console.error('Transaction error', error);
    }
  };

  const handleWriteDeposit = () => {
    try {
      writeDeposit({
        address: daoContractAddress,
        abi: pillarDaoNftABI,
        functionName: 'deposit',
        args: [amount],
      });
    } catch (error) {
      console.error('Transaction error', error);
    }
  };

  useEffect(() => {
    setIsUsingPolygon(isConnected && chainId == polygonChainId);
  }, [chainId]);

  const isTxButtonDisabled = () => {
    return (
      isApproveTxPending || isDepositTxPending || (!isUsingPolygon && (!isDepositTxPending || !isApproveTxPending))
    );
  };

  return (
    <>
      <div>
        {
          <div>
            <button disabled={isUsingPolygon} onClick={() => switchChain({ chainId: polygonChainId })}>
              {isUsingPolygon && <span>✅</span>} Switch to Polygon
            </button>
          </div>
        }
        <button
          style={{ display: 'flex', justifyContent: 'center' }}
          onClick={() => handleTransaction()}
          disabled={isTxButtonDisabled()}
        >
          {isDepositTxPending || isApproveTxPending ? 'Sending...' : 'Send Transaction'}
        </button>

        {(isDepositTxSuccess || isApproveTxSuccess) && (
          <div>Transaction sent! Hash: {depositData?.hash ?? approveData?.hash}</div>
        )}
        {(isDepositTxError || isApproveTxError) && (
          <div>Error: {JSON.stringify(depositError) ?? JSON.stringify(approveError) ?? ''}</div>
        )}
      </div>

      <RestartButton title="Logout and Restart" disabled={isApproveTxPending || isDepositTxPending} onClick={onLogout}>
        ⟳
      </RestartButton>
    </>
  );
};

export default DaoMemberNftTx;
