/**
 * REGULAR PLR STAKING FLOW (Etherspot Integration)
 *
 * Page: /staking
 * Purpose: Stake PLR to earn WETH rewards (uses Etherspot UI)
 *
 * ⚠️ IMPORTANT: This is for regular staking (stkPLR tokens)
 * ❌ DO NOT confuse with DAO governance staking (NFT membership)
 *
 * Note: Etherspot handles staking/unstaking UI internally
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

import { themeOverride } from '../../styles/buidlerTheme';

export const OPENLOGIN_STORE = 'openlogin_store';
export const WAGMI_STORE = 'wagmi.store';

const LoadingComponent = () => <p>Loading...</p>;

const Etherspot = lazy(() =>
  import('@etherspot/react-transaction-buidler').then((mod) => ({ default: mod.Etherspot }))
);

const PlrStakingBuilder = ({ defaultTransactionBlock }) => {
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { isConnected, connector } = useAccount();
  const [provider, setProvider] = useState(null);

  // Get provider from wagmi connector when connected
  useEffect(() => {
    const getProvider = async () => {
      if (!isConnected || !connector) {
        setProvider(null);
        return;
      }

      try {
        const walletProvider = await connector.getProvider();
        setProvider(walletProvider);
      } catch (error) {
        console.error('Error getting provider:', error);
        setProvider(null);
      }
    };

    getProvider();
  }, [isConnected, connector]);

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
    <PlrStakingBuilderWrapper>
      {!provider && !isConnected && (
        <ConnectWalletWrapper>
          <Title id="connect-wallet" style={{ scrollMarginTop: '100px' }}>
            Connect Wallet
          </Title>
          <ConnectKitButton />
        </ConnectWalletWrapper>
      )}
      {provider && isConnected && (
        <Suspense fallback={<LoadingComponent />}>
          <>
            <Etherspot
              provider={provider}
              chainId={137}
              themeOverride={themeOverride}
              defaultTransactionBlocks={[{ type: defaultTransactionBlock, closeable: false }]}
              hideWalletToggle
              hideAddTransactionButton
              hideBuyButton
              showMenuLogout
              onLogout={onLogout}
              onlyPolygonInPLRStaking
              plrStakingTitle="Pillar Staking Program"
            />
            <div class="p-3">Compatible browsers: Chrome, Firefox</div>
          </>
        </Suspense>
      )}
    </PlrStakingBuilderWrapper>
  );
};

export default PlrStakingBuilder;

const PlrStakingBuilderWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
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
