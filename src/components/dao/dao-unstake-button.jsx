/**
 * ⚠️ DAO GOVERNANCE NFT UNSTAKE BUTTON
 *
 * For: /plr-dao-staking page (DAO governance NFT membership)
 * Checks: NFT membership ID (not token balance!)
 * Contract: 0xc380f15Db7be87441d0723F19fBb440AEaa734aB (mainnet)
 *          0xf1a8685519D456f47a9F3505035F4Bad5d9a9ce0 (testnet)
 * Function: withdraw() - burns NFT, returns staked PLR
 *
 * ❌ DO NOT use on /staking page
 * ✅ USE UnstakeButton for regular PLR staking (stkPLR) instead
 *
 * See STAKING_COMPONENTS.md for details
 */

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import pillarDaoNftABI from '../../data/abis/pillarDaoNftStake.json';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Checkmark = styled.div`
  margin-right: 0.5rem;
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
  animation: ${fadeIn} 0.5s ease-out;
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

const ChainMessage = styled.div`
  width: 100%;
  max-width: 80%;
  padding: 0.875rem 1.25rem;
  border-radius: 24px;
  background: rgba(105, 0, 136, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  text-align: center;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const DaoUnstakeButton = ({ chainId, contract, explorer, networkName }) => {
  const evmChainId = chainId;
  const contractAddress = contract;
  const chainExplorer = explorer;

  const [isUsingCorrectChain, setIsUsingCorrectChain] = useState(true);
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const [buttonText, setButtonText] = useState('Withdraw & Burn NFT');
  const [withdrawTxHash, setWithdrawTxHash] = useState('');
  const [errorText, setErrorText] = useState('');

  const {
    address: walletAddress,
    chainId: walletChainId,
    isConnected,
  } = useAccount();

  // Check if user has a membership NFT
  const { data: membershipId, refetch: refetchMembershipId } = useReadContract({
    address: contractAddress,
    abi: pillarDaoNftABI,
    functionName: 'membershipId',
    args: [walletAddress],
    chainId: evmChainId,
    query: {
      enabled: !!walletAddress && isConnected,
    },
  });

  const hasMembership = membershipId && membershipId.toString() !== '0';

  useEffect(() => {
    setIsUsingCorrectChain(walletChainId === evmChainId);
  }, [walletChainId, evmChainId]);

  const {
    writeContract: writeWithdraw,
    isSuccess: isWithdrawSuccess,
    isPending: isWithdrawPending,
    isError: isWithdrawError,
    error: withdrawError,
    data: withdrawData,
  } = useWriteContract();

  const handleWithdraw = async () => {
    if (!hasMembership) {
      alert('You do not have an active membership to withdraw');
      return;
    }

    setButtonText('Withdrawing...');
    setErrorText('');

    writeWithdraw(
      {
        address: contractAddress,
        abi: pillarDaoNftABI,
        functionName: 'withdraw',
        args: [],
        account: walletAddress,
      },
      {
        onSuccess: (hash) => {
          setWithdrawTxHash(hash);
          setButtonText('Withdraw successful!');
          refetchMembershipId();
        },
        onError: (error) => {
          console.error('Withdraw failed:', error);
          setErrorText(error.shortMessage || 'Withdrawal failed');
          setButtonText('Withdraw & Burn NFT');
        },
      },
    );
  };

  useEffect(() => {
    if (!isUsingCorrectChain || !hasMembership) {
      setButtonEnabled(false);
    } else if (isWithdrawPending || isWithdrawSuccess) {
      setButtonEnabled(false);
    } else {
      setButtonEnabled(true);
    }
  }, [isUsingCorrectChain, hasMembership, isWithdrawPending, isWithdrawSuccess]);

  if (!hasMembership) {
    return (
      <Wrapper>
        <ButtonWrapper>
          <TxInfo>You do not have an active DAO membership to withdraw</TxInfo>
        </ButtonWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {!isUsingCorrectChain && (
        <ChainMessage>
          Please switch your wallet to {networkName} (Chain ID: {evmChainId}) to proceed with withdrawal.
        </ChainMessage>
      )}
      <ButtonWrapper>
        <TransactionButton onClick={handleWithdraw} disabled={!isButtonEnabled}>
          {isWithdrawSuccess && (
            <Checkmark>
              <FaCheck />
            </Checkmark>
          )}
          {buttonText}
        </TransactionButton>
        {withdrawTxHash && (
          <TxInfo>
            <div>Withdraw Transaction sent!</div>
            <a href={`${chainExplorer}${withdrawTxHash}`} target="_blank" rel="noopener nofollow noreferrer">
              View On Explorer
            </a>
          </TxInfo>
        )}
        {isWithdrawError && (
          <TxInfo id="errorMessage">
            <div>Withdrawal failed. Please try again.</div>
            <div>{errorText}</div>
          </TxInfo>
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default DaoUnstakeButton;
