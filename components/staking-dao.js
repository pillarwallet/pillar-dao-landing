import React from 'react';
import Link from 'next/link';
import stakeIcon from '../assets/images/stake-icon.png';
import mintIcon from '../assets/images/mint-icon.png';
import appIos from '../assets/images/app-ios.svg';
import appAndroid from '../assets/images/app-android.svg';
import ecoSystemLogo from '../assets/images/dao-ecosystem-logos.png';
import communityIcon from '../assets/images/community-icon.png';

const StakingDao = () => {
  return (
    <>
      <section className="staking_dao" id="about">
        <div className="staking_dao__staking">
          <div className="container">
            <div className="staking_dao__staking__headline">
              <h2>
                How <span style={{ fontWeight: 'bold' }}>PillarDAO Staking</span>&nbsp;Works
              </h2>
            </div>

            <div className="staking_dao__staking__cards">
              <div className="staking_dao__staking__cards__detail">
                <img src={stakeIcon} alt="" />
                <h3>Stake</h3>
                <p>
                  Stake PLR tokens for rewards paid by our Ethereum validator node in ETH. Each account can stake up to
                  250,000 PLR tokens.
                </p>
              </div>
              <div className="staking_dao__staking__cards__detail">
                <img src={mintIcon} alt="" />
                <h3>Mint</h3>
                <p>
                  When staking PLR you mint staked tokens (stkPLR) which are issued 1:1 to your initial stake amount and
                  are held in your wallet.
                </p>
              </div>
              <div className="staking_dao__staking__cards__detail">
                <img src={communityIcon} alt="" />
                <h3>Community</h3>
                <p>
                  PillarDAO is a community that builds decentralized tools for Web3 simplifation and governs the
                  direction PillarDAO
                </p>
              </div>
            </div>

            <div className="staking_dao__staking__app">
              <h3>
                Download <span>Pillar Wallet</span> To&nbsp;Manage Your <br />
                PLR Staking Porfolio
              </h3>
              <div className="staking_dao__staking__app__download">
                <Link
                  href="https://apps.apple.com/app/apple-store/id1346582238?pt=118878535&ct=pillar.fi&mt=8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={appIos}
                    alt="Download Pillar from App Store Apple"
                    title="Download Pillar from App Store Apple"
                  />
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.pillarproject.wallet&referrer=utm_source%3Dpillar.fi%26utm_medium%3Ddownload%26utm_campaign%3Dandroid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={appAndroid}
                    alt="Download Pillar from Google Play Store"
                    title="Download Pillar from Google Play Store"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="staking_dao__foundation">
          <div className="container">
            <div className="staking_dao__foundation__headline">
              <h3>
                Pillar Project Foundation, after receiving a successfully passed proposal by PillarDAO, has set up an
                Ethereum Network validation node and funded it with the required 32 ETH. The node will receive{' '}
                <Link href="https://ethereum.org/en/staking/" target="_blank" rel="noopener noreferrer">
                  percentage rewards
                </Link>{' '}
                of the staked amount. This percentage is a fluctuating amount.
              </h3>
            </div>
          </div>
        </div>

        <div className="staking_dao__faq">
          <div className="container">
            <div className="staking_dao__faq__detail">
              <h2>Withdrawals & Staking Terms</h2>
              <p>
                The Ethereum Foundation has stated that withdrawals of stked ETH and rewards will not be available for
                12 months after The Merge. With this in mind, all staked PLR will be locked until after this period has
                completed. Then the personally set stake period will commence.
                <br />
                <br /> Once the personally set period has concluded, ETH rewards will be open for withdrawal and
                un-staking PLR tokens can also be done.
              </p>
            </div>
            <div className="staking_dao__faq__detail">
              <h1>When can I claim my ETH?</h1>
              <p>
                Withdraw functionality is expected to be included in the next network upgrade, named Shanghai. This
                network upgrade is estimated for the first half of 2023, subject to change untill completed. After the
                Shanghai update, stakers will then be able to withdraw their rewards from their validator balance if
                they choose.
              </p>
            </div>
          </div>
        </div>

        <div className="staking_dao__ecosystem">
          <div className="container">
            <div className="staking_dao__ecosystem__detail">
              <h2>PillarDAO’s growing ecosystem</h2>
              <h3>PillarDAO is BUIDLing!</h3>
              <p>
                All revenue from Pillar Project’s tools are directed to the PillarDAO treasury. The treasury was donated
                to the PillarDAO by Pillar Foundation
              </p>
              <img style={{ width: '100%' }} src={ecoSystemLogo} aria-setsize={'15px'} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingDao;
