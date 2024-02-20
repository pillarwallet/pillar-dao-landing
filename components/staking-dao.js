import React from 'react';
import Link from 'next/link';
import stakeIcon from '../assets/images/stake-icon.png';
import mintIcon from '../assets/images/mint-icon.png';
import communityIcon from '../assets/images/community-icon.png';
import unionIcon from '../assets/images/union.svg';

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
                  Stake PLR tokens for rewards paid by our Ethereum validator node in WETH on Polygon. Each account can
                  stake up to 250,000 PLR Tokens on Polygon
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
                <h3>Claim</h3>
                <p>
                  PLR stakers will be able to claim their rewards in the staking dApp 52 weeks (12 months) after the
                  staking window closes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="staking_dao__foundation">
          <div className="container" style={{ borderColor: 'transparent' }}>
            <div className="staking_dao__foundation__headline">
              <h4>Join PillarDAO!</h4>
              <h3>
                Become a PillarDAO member to steer the direction of the PillarDAO ecosystem and help make decisions that
                shape our decentralised future
              </h3>
              <Link
                href="/#governor"
                target="_blank"
                rel="noopener noreferrer"
                className="staking__learn__more__text__discord"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>

        <div className="staking_get__here__details">
          <div className="container">
            <img className="staking_about__icon" src={unionIcon} alt="" />
            <div className="staking_about__headline">
              <h2>How Did We Get Here?</h2>
            </div>
            <div className="staking_application_cards__detail">
              <div className="staking_application__detail">
                <p>
                  After PillarDAO successfully passed a governance proposal, an Ethereum Network validation node was
                  established and funded with the required 32 ETH. The node will receive percentage rewards for staking
                  the 32 ETH. This percentage is a fluctuating amount. All users who stake PLR tokens on the PillarDAO
                  staking smart contract will share the node validator rewards proportionally in WETH on Polygon
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="staking_dao__faq">
          <div className="container">
            <div className="staking_dao__faq__detail">
              <h2>Withdrawals & Staking Terms</h2>
            </div>

            <div className="staking_dao__faq__detail" style={{ paddingTop: 0 }}>
              <p>
                The PLR staking dApp is run by a smart contract (deployed on Polygon) that locks all PLR tokens that are
                staked for a minimum period of 52 weeks.
                <br />
                <br />
                Claiming will become possible 52 weeks (12 months) after the staking window closes.
                <br />
                <br />
                Stakers will be notified when the claiming period goes live. Users can follow PillarDAO’s social media
                channels (
                <Link href="https://twitter.com/pillar_dao" className="btn">
                  Twitter
                </Link>
                ,{' '}
                <Link href="https://chat.pillar.fi/" className="btn">
                  Discord
                </Link>
                ).
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingDao;
