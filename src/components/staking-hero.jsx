/**
 * REGULAR PLR STAKING PAGE - Hero Section
 *
 * Page: /staking
 * Purpose: Unstake stkPLR tokens from the regular staking pool
 *
 * ⚠️ IMPORTANT: Uses UnstakeButton (checks stkPLR balance)
 * ❌ DO NOT use DaoUnstakeButton here (that's for NFT governance)
 */

import { lazy, Suspense, useState } from 'react';
import styled from 'styled-components';

const SignIn = lazy(() => import('./auth/wallet-connect'));
const UnstakeButton = lazy(() => import('./staking/unstake-button')); // ✅ Correct for regular staking

const AlternativeMethodSection = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(43, 1, 64, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
`;

const AlternativeMethodToggle = styled.button`
  background: none;
  border: none;
  color: #78e8f6;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'PTRootUIWebMedium', sans-serif;
  text-decoration: underline;
  padding: 0;

  &:hover {
    opacity: 0.8;
  }
`;

const AlternativeMethodContent = styled.div`
  margin-top: 1rem;
  color: #fff;
  line-height: 1.6;

  h3 {
    color: #78e8f6;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  ol {
    padding-left: 1.5rem;

    li {
      margin-bottom: 1rem;

      strong {
        color: #78e8f6;
      }

      a {
        color: #78e8f6;
        text-decoration: underline;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  img {
    width: 100%;
    max-width: 500px;
    margin: 1rem auto;
    display: block;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .note {
    background: rgba(255, 200, 0, 0.1);
    border-left: 3px solid #ffc800;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }
`;

// stkPLR staking contract (Polygon mainnet)
// This is the regular staking pool, NOT the DAO governance NFT staking
const STAKING_CONTRACT = '0x826a26e65266c5834977D4f552d31b9e29F668d4';
const POLYGON_CHAIN_ID = 137;
const EXPLORER = 'https://polygonscan.com/tx/';

const StakingHero = () => {
  const [showAlternativeMethod, setShowAlternativeMethod] = useState(false);

  return (
    <>
      <section className="staking_hero" id="home">
        <div className="container">
          <div className="staking_hero__headline">
            <h1>Unstake your PLR tokens</h1>
          </div>
          <div className="staking_hero__dapp">
            <Suspense fallback={<p>Loading...</p>}>
              <UnstakeButton
                chainId={POLYGON_CHAIN_ID}
                contract={STAKING_CONTRACT}
                explorer={EXPLORER}
                networkName="Polygon Mainnet"
              />
            </Suspense>
            <p style={{ textAlign: 'center' }}>Supported browsers: Chrome, Firefox <br />Supported wallet: MetaMask</p>

            <AlternativeMethodSection>
              <AlternativeMethodToggle onClick={() => setShowAlternativeMethod(!showAlternativeMethod)}>
                {showAlternativeMethod ? '▼' : '▶'} Alternative Method: Unstake Using Block Explorer
              </AlternativeMethodToggle>

              {showAlternativeMethod && (
                <AlternativeMethodContent>
                  <h3>How to Unstake Manually via Blockchain Explorer</h3>
                  <p>You can also unstake directly through the blockchain explorer:</p>

                  <img
                    src="/src/assets/images/unstake-using-block-explorer.png"
                    alt="Block explorer interface overview"
                  />

                  <ol>
                    <li>
                      <strong>Visit the contract:</strong> Go to{' '}
                      <a
                        href="https://polygon.blockscout.com/address/0x826a26e65266c5834977D4f552d31b9e29F668d4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        the staking contract on Blockscout
                      </a>
                    </li>
                    <li>
                      <strong>Navigate to the contract interface:</strong> Click on the "Contract" tab, then select "Write Contract"
                    </li>
                    <li>
                      <strong>Connect your wallet:</strong> Click "Connect Wallet" and sign in with MetaMask or your preferred wallet
                      <div className="note">
                        ⚠️ Important: Your wallet must be connected to the Polygon network and must contain your stkPLR tokens
                      </div>
                    </li>
                    <li>
                      <strong>Execute the unstake function:</strong> Scroll down to find the "unstake" function and click "Write"
                      <img
                        src="/src/assets/images/unstake-using-block-explorer-unstake-function.png"
                        alt="Unstake function in block explorer"
                      />
                    </li>
                    <li>
                      <strong>Confirm the transaction:</strong> Review all transaction details and fees carefully, then confirm to complete your unstaking
                    </li>
                  </ol>
                </AlternativeMethodContent>
              )}
            </AlternativeMethodSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingHero;
