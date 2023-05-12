import React, { useEffect, useState } from "react";
import Link from "next/link";
import stakeIcon from "../assets/images/stake-icon.png";
import mintIcon from "../assets/images/mint-icon.png";
import appIos from "../assets/images/app-ios.svg";
import appAndroid from "../assets/images/app-android.svg";
import communityIcon from "../assets/images/community-icon.png";
import logoEtherspotSdk from "../assets/images/logo-etherspot-sdk.png";
import logoEtherspotBuidler from "../assets/images/logo-etherspot-buidler.png";
import logoTransactionKit from "../assets/images/logo-transactionkit.png";
import logoPillar from "../assets/images/logo-pillar.png";
import logoAirdropme from "../assets/images/logo-airdropme.png";

const StakingDao = () => {
  return (
    <>
      <section className="staking_dao" id="about">
        
        <div className="staking_dao__staking">
          <div className="container">
            <div className="staking_dao__staking__headline">
              <h2>How <span>PLR Staking</span>&nbsp;Works</h2>
            </div>

            <div className="staking_dao__staking__cards">
              <div className="staking_dao__staking__cards__detail">
                <img src={stakeIcon} alt="" />
                <h3>Stake</h3>
                <p>Stake PLR tokens for rewards paid by our Ethereum validator node in ETH. The minimum staking amount is 10,000 PLR. Each account can stake up to 250,000 PLR tokens.</p>
              </div>
              <div className="staking_dao__staking__cards__detail">
                <img src={mintIcon} alt="" />
                <h3>Mint</h3>
                <p>When staking PLR you mint staked tokens (stkPLR) which are issued 1:1 to your initial stake amount and are held in your wallet.</p>
              </div>
              <div className="staking_dao__staking__cards__detail">
                <img src={communityIcon} alt="" />
                <h3>Claim</h3>
                <p>PLR stakers will be able to claim their rewards on the dapp three months after staking has initiated and every three months after that.</p>
              </div>
            </div>
            
            <div className="staking_dao__staking__app">
              <h3>Download <span>Pillar Wallet</span> To&nbsp;Manage Your <br/>PLR Staking Porfolio</h3>
              <div className="staking_dao__staking__app__download">
                <Link href="https://apps.apple.com/app/apple-store/id1346582238?pt=118878535&ct=pillar.fi&mt=8" target="_blank" rel="noopener noreferrer">
                  <img src={appIos} alt="Download Pillar from App Store Apple" title="Download Pillar from App Store Apple" />
                </Link>
                <Link href="https://play.google.com/store/apps/details?id=com.pillarproject.wallet&referrer=utm_source%3Dpillar.fi%26utm_medium%3Ddownload%26utm_campaign%3Dandroid" target="_blank" rel="noopener noreferrer">
                  <img src={appAndroid} alt="Download Pillar from Google Play Store" title="Download Pillar from Google Play Store" />
                </Link>
              </div>
            </div>
            

          </div>
        </div>

        <div className="staking_dao__foundation">
          <div className="container">
            <div className="staking_dao__foundation__headline">
              <h2>How Did We Get Here?</h2>
              <h3>Pillar Project Foundation, after receiving a successfully passed proposal by Pillarstaking_dao, has set up an Ethereum Network validation node and funded it with the required 32 ETH. The node will receive <Link href="https://ethereum.org/en/staking/" target="_blank" rel="noopener noreferrer">percentage rewards</Link> of the validator amount. This percentage is a fluctuating amount. All&nbsp;accounts that stake PLR tokens on our smart contract will share the node validators rewards proportionally.</h3>
            </div>
          </div>
        </div>

        <div className="staking_dao__faq">
          <div className="container">
            <div className="staking_dao__faq__detail">
              <h2>Withdrawals & Staking Terms</h2>
              <p>The PLR staking dapp is run by a smart contract that locks all PLR tokens that are staked for a minimum period of 52 weeks. People who stake PLR will, however, be able to withdraw staking rewards periodically during these 52 weeks.<br/><br/>Claiming will become possible after three months after staking has initiated and every three months after that. Stakers will be notified when the claiming periods go live. Users can follow Pillar Wallet’s social media channels (<Link href="https://twitter.com/PillarWallet" target="_blank" rel="noopener noreferrer">Twitter</Link>, <Link href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer">Discord</Link>, <Link href="https://t.me/pillarofficial" target="_blank" rel="noopener noreferrer">Telegram</Link>) for the&nbsp;updates or alternatively sign up for email notifications&nbsp;<Link href="https://www.pillar.fi/#footer">here</Link>.</p>
            </div>
          </div>
        </div>

        <div className="staking_dao__ecosystem">
          <div className="container">
            <div className="staking_dao__ecosystem__detail">
              <h2>PillarDAO’s growing ecosystem</h2>
              <h3>PillarDAO is BUIDLing!</h3>
              <p>All revenue from Pillar Project’s tools are directed to the PillarDAO treasury. The treasury was donated to the PillarDAO by Pillar Foundation</p>
              <div className="staking_dao__ecosystem__detail__list">
                <Link href="https://etherspot.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoEtherspotSdk} alt="Etherspot SDK" title="Etherspot SDK" />
                </Link>
                <Link href="http://buidler.etherspot.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoEtherspotBuidler} alt="Etherspot BUIDLer" title="Etherspot BUIDLer" />
                </Link>
                <Link href="https://etherspot.io/transactionkit/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoTransactionKit} alt="TransactionKit" title="TransactionKit" />
                </Link>
                <Link href="https://www.pillar.fi/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoPillar} alt="Pillar" title="Pillar" />
                </Link>
                <Link href="https://airdropme.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoAirdropme} alt="AirdropMe" title="AirdropMe" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default StakingDao;