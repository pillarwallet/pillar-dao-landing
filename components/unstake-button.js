import { getBalance } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import { useAccount, useWriteContract } from 'wagmi';
import { wagmiConfig } from 'wagmi-config';
import pillarStaking from '../data/abis/plrStaking.json';

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

//#endregion Styled

const UnstakeButton = ({ chainId, contract, explorer }) => {
  const evmChainId = chainId;
  const contractAddress = contract;
  const chainExplorer = explorer;
  console.log('UnstakeButton', chainId, contract, explorer);

  const [isUsingPolygon, setIsUsingPolygon] = useState(true);
  const [isUsingWalletConnect, setIsUsingWalletConnect] = useState(false);
  const [isButtonEnabled, setButtonEnabled] = useState(true);
  const [buttonText, setButtonText] = useState('Unstake');
  const [unstakeTxData, setUnstakeTxData] = useState('');
  const [errorText, setErrorText] = useState('');
  const {
    address: walletAddress,
    chainId: walletChainId,
    connector,
    isConnected,
    status: accountStatus,
  } = useAccount();

  useEffect(() => {
    setIsUsingPolygon(walletChainId === evmChainId);
  }, [accountStatus, walletChainId, evmChainId]);

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
        console.log('Balance:', balance);
        return balance.value.toString();
      })
      .catch((error) => {
        console.error('Error getting balance:', error);
        setErrorText(error.shortMessage);
        return '0';
      });

    console.log('Returned value:', returnedValue);

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
          console.log('Approve successful:', data);
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
                console.log('Unstake successful:', data);
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
    if (connector.type === 'walletConnect') {
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
      <ButtonWrapper>
        <TransactionButton id="unstakeTransaction" onClick={handleUnstakeTransaction} disabled={!isButtonEnabled}>
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
      </ButtonWrapper>
    </Wrapper>
  );
};

UnstakeButton.defaultProps = {
  chainId: 80002,
  contract: '0xf1a8685519d456f47a9f3505035f4bad5d9a9ce0',
  explorer: `https://polygonscan.com/tx/`,
};

export default UnstakeButton;
