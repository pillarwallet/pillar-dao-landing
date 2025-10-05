/**
 * ⚠️ REGULAR PLR STAKING UNSTAKE BUTTON
 *
 * For: /staking page (regular PLR staking pool)
 * Checks: stkPLR token balance (0x99b4071d2509f3bfb4c1f9cbe174da1f3dc43480)
 * Contract: 0x826a26e65266c5834977D4f552d31b9e29F668d4 (Polygon mainnet)
 * Function: unstake() - requires stkPLR approval first
 *
 * ❌ DO NOT use on /plr-dao-staking page
 * ✅ USE DaoUnstakeButton for DAO governance NFT staking instead
 *
 * See STAKING_COMPONENTS.md for details
 */

import { getBalance } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import { useAccount, useChainId, useConfig, useDisconnect, useWriteContract } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import pillarStaking from '../../data/abis/plrStaking.json';

//#region Styled

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
  margin: 0 auto 1rem auto;
`;

const DisconnectButton = styled.button`
  font-family: 'PTRootUIWebMedium', sans-serif;
  color: #fff;
  font-size: 0.875rem;
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  background-color: rgba(92, 0, 136, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: rgba(69, 0, 95, 0.7);
  }
`;

//#endregion Styled

const UnstakeButton = ({
  chainId = 80002,
  contract = '0xf1a8685519d456f47a9f3505035f4bad5d9a9ce0',
  explorer = 'https://polygonscan.com/tx/',
  networkName = 'Polygon Amoy Testnet'
}) => {
  const evmChainId = chainId;
  const contractAddress = contract;
  const chainExplorer = explorer;
  const displayNetworkName = networkName || 'Polygon Mainnet';
  const isTestnetMode = import.meta.env.VITE_USE_TESTNET === 'true';

  const [isUsingPolygon, setIsUsingPolygon] = useState(false);
  const [isUsingWalletConnect, setIsUsingWalletConnect] = useState(false);
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const [buttonText, setButtonText] = useState('Unstake');
  const [unstakeTxData, setUnstakeTxData] = useState('');
  const [errorText, setErrorText] = useState('');
  const wagmiConfig = useConfig();
  const currentChainId = useChainId();
  const { disconnect } = useDisconnect();
  const {
    address: walletAddress,
    connector,
    isConnected,
    status: accountStatus,
  } = useAccount();

  const handleDisconnect = () => {
    disconnect();
  };

  useEffect(() => {
    setIsUsingPolygon(currentChainId === evmChainId);
  }, [currentChainId, evmChainId, isConnected]);

  const {
    writeContract: writeUnstake,
    isSuccess: isUnstakeTxSuccess,
    isPending: isUnstakeTxPending,
    isError: isUnstakeTxError,

    error: unstakeError,
    status: unstakeStatus,
  } = useWriteContract();

  const {
    writeContract: writeApproval,
    isSuccess: isApprovalTxSuccess,
    isPending: isapprovalTxPending,
    isError: isapprovalTxError,

    error: approvalError,
    status: approvalStatus,
  } = useWriteContract();

  const handleUnstakeTransaction = async () => {
    // First we need to get the balance of the tokens that the account
    // holds for stkPLR
    setButtonText('Getting balance...');
    const returnedValue = await getBalance(wagmiConfig, {
      address: walletAddress,
      token: '0x99b4071d2509f3bfb4c1f9cbe174da1f3dc43480',
    })
      .then((balance) => {
        return balance.value.toString();
      })
      .catch((error) => {
        console.error('Error getting balance:', error);
        setErrorText(error.shortMessage);
        return '0';
      });

    if (returnedValue === '0') {
      alert('You have no tokens to unstake');
      setButtonText('Unstake');
      return;
    }

    setButtonText('Approving...');

    // Then we need to approve the contract to spend the tokens
    // Then we can call the stake function
    writeApproval(
      {
        functionName: 'approve',
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'spender',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            name: 'approve',
            outputs: [
              {
                internalType: 'bool',
                name: '',
                type: 'bool',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        address: '0x99b4071d2509f3bfb4c1f9cbe174da1f3dc43480',
        args: [contractAddress, returnedValue],
        account: walletAddress,
      },
      {
        onSuccess: (data) => {
          setButtonText('Approval transaction sent - sending unstaking transaction...');

          writeUnstake(
            {
              functionName: 'unstake',
              abi: pillarStaking,
              address: contractAddress,
              args: [],
              account: walletAddress,
            },
            {
              onSuccess: (data) => {
                setUnstakeTxData(data);
                setButtonText('Unstake transaction sent...');
              },
              onError: (error) => {
                console.error('Unstake failed:', error);
                alert('Error unstaking - ' + error.shortMessage);
                setButtonText('Unstake');
              },
            },
          );
        },
        onError: (error) => {
          console.error('Approve failed:', error);
          alert('Error approving - ' + error.shortMessage);
          setButtonText('Unstake');
        },
      },
    );
  };

  useEffect(() => {
    if (connector?.type === 'walletConnect') {
      setIsUsingWalletConnect(true);
    }
  }, [connector]);

  useEffect(() => {
    function changeButton() {
      if (!isUsingPolygon) {
        setButtonEnabled(false);
      } else {
        if (unstakeStatus === 'pending' || unstakeStatus === 'success') {
          setButtonEnabled(false);
        } else {
          setButtonEnabled(true);
        }
      }
    }
    changeButton();
  }, [unstakeStatus, isUsingPolygon]);

  return (
    <Wrapper>
      {/* <WrapperTitle>Unstake</WrapperTitle> */}
      {!isConnected ? (
        <>
          <ChainMessage>
            Connect your wallet to unstake your PLR tokens
          </ChainMessage>
          <ButtonWrapper>
            <ConnectKitButton />
          </ButtonWrapper>
        </>
      ) : (
        <>
          {isTestnetMode && (
            <ChainMessage>
              ⚠️ Testnet mode is enabled. This unstaking flow only supports Polygon Mainnet contracts. Please disable testnet mode in your .env file to use this feature.
            </ChainMessage>
          )}
          {!isTestnetMode && !isUsingPolygon && !isButtonEnabled && (
            <ChainMessage>
              Please switch your wallet to {displayNetworkName} (Chain ID: {evmChainId}) to proceed with unstaking.
            </ChainMessage>
          )}
          <ButtonWrapper>
            <TransactionButton id="unstakeTransaction" onClick={handleUnstakeTransaction} disabled={!isButtonEnabled || isTestnetMode}>
              {isUnstakeTxSuccess && (
                <Checkmark>
                  <FaCheck />
                </Checkmark>
              )}
              {buttonText}
            </TransactionButton>
            {unstakeTxData.length > 1 && (
              <TxInfo>
                <div>Unstake Transaction sent!</div>
                <a href={`${chainExplorer}${unstakeTxData}`} target="_blank" rel="noopener nofollow noreferrer">
                  View On Explorer
                </a>
              </TxInfo>
            )}
            {isUnstakeTxError && (
              <TxInfo id="errorMessage">
                <div>Something went wrong. Please try again.</div>
                <div>{errorText}</div>
              </TxInfo>
            )}
            <DisconnectButton onClick={handleDisconnect}>
              Disconnect Wallet
            </DisconnectButton>
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default UnstakeButton;
