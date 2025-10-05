/**
 * DAO GOVERNANCE NFT UNSTAKE FLOW
 *
 * Page: /plr-dao-staking (unstake section)
 * Purpose: Wrapper for DAO unstake functionality
 *
 * ⚠️ IMPORTANT: Uses DaoUnstakeButton (checks NFT membership)
 * ❌ DO NOT use UnstakeButton here (that's for regular stkPLR staking)
 */

import { useEffect, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import DaoUnstakeButton from './dao-unstake-button'; // ✅ Correct for DAO governance
import { contractConfig } from '../../config/contracts';

export const OPENLOGIN_STORE = 'openlogin_store';
export const WAGMI_STORE = 'wagmi.store';

// Contract configuration - auto-switches between mainnet/testnet based on NEXT_PUBLIC_USE_TESTNET
const polygonChainId = contractConfig.chainId;
const daoContractAddress = contractConfig.daoContract;
const explorer = contractConfig.explorer;

const LoadingComponent = () => <p>Loading...</p>;

const PlrDaoStakingBuilderUnstake = () => {
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const onLogout = async () => {
    try {
      if (isConnected) {
        wagmiDisconnect();
      }
    } catch (e) {
      console.error('onLogout error:', e);
    }
  };

  return (
    <PlrDaoStakingBuilderWrapper>
      {!isConnected && (
        <ConnectWalletWrapper>
          <Title id="connect-wallet" style={{ scrollMarginTop: '100px' }}>
            Connect Wallet
          </Title>
          <ConnectKitButton />
        </ConnectWalletWrapper>
      )}
      {isConnected && (
        <DaoUnstakeButton
          chainId={polygonChainId}
          contract={daoContractAddress}
          explorer={explorer}
          networkName={contractConfig.networkName}
        />
      )}
    </PlrDaoStakingBuilderWrapper>
  );
};

export default PlrDaoStakingBuilderUnstake;

const PlrDaoStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ConnectWalletWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 24px;
  background: rgba(43, 1, 64, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: #78e8f6;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: 'PTRootUIWebMedium', sans-serif;
`;
