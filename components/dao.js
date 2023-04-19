import React, { useEffect, useState } from "react";
import stakeIcon from "../assets/images/stake-icon.png";
import mintIcon from "../assets/images/mint-icon.png";
import communityIcon from "../assets/images/community-icon.png";
import logoEtherspotBuidler from "../assets/images/logo-etherspot-buidler.png";
import logoEtherspotSdk from "../assets/images/logo-etherspot-sdk.png";
import logoEtherspotDashboard from "../assets/images/logo-etherspot-dashboard.png";
import logoPillar from "../assets/images/logo-pillar.png";
import logoAirdropme from "../assets/images/logo-airdropme.png";

const Dao = () => {
  return (
    <>
      <section className="dao" id="about">
        
        <div className="dao__staking">
          <div className="container">
            <div className="dao__staking__headline">
              <h2>How <span>PillarDAO Staking</span>&nbsp;Works</h2>
            </div>

            <div className="dao__staking__cards">
              <div className="dao__staking__cards__detail">
                <img src={stakeIcon} alt="" />
                <h3>Stake</h3>
                <p>PillarDAO lets users stake their PLR tokens for staking rewards paid in ETH. User can stake up to 250,000 PLR tokens.</p>
              </div>
              <div className="dao__staking__cards__detail">
                <img src={mintIcon} alt="" />
                <h3>Mint</h3>
                <p>When staking PLR you mint staked tokens (stkPLR) which are issued 1:1 to your initial stake amount and are held in your wallet</p>
              </div>
              <div className="dao__staking__cards__detail">
                <img src={communityIcon} alt="" />
                <h3>Community</h3>
                <p>PillarDAO is a community that builds decentralized tools for Web3 simplification and governs the direction PillarDAO</p>
              </div>
            </div>

          </div>
        </div>

        <div className="dao__foundation">
          <div className="container">
            <div className="dao__foundation__headline">
              <h3>Pillar Project Foundation, after receiving a successfully passed proposal by PillarDAO, has set up an Ethereum Network validation node and funded it with the required 32 ETH. The node will receive percentage rewards of the staked amount. This percentage is a fluctuating amount.</h3>
            </div>
          </div>
        </div>

        <div className="dao__faq">
          <div className="container">
            <div className="dao__faq__detail">
              <h2>Withdrawals & Staking Terms</h2>
              <p>The PLR staking dapp is run by a smart contract that locks all PLR tokens that are staked for a minimum period of 52 weeks. People who stake PLR will, however, be able to withdraw staking rewards periodically during these 52 weeks.<br/><br/>Claiming will become possible at the end of each calendar quarter. Stakers will be notified when the claiming periods go live. Users can follow Pillar Wallet’s social media channels (<a href="https://twitter.com/PillarWallet" target="_blank" rel="noopener noreferrer">Twitter</a>, <a href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer">Discord</a>, <a href="https://t.me/pillarofficial" target="_blank" rel="noopener noreferrer">Telegram</a>) for the&nbsp;updates or alternatively sign up for email notifications&nbsp;<a href="https://www.pillar.fi/#footer">here</a>.</p>
            </div>
          </div>
        </div>

        <div className="dao__ecosystem">
          <div className="container">
            <div className="dao__ecosystem__detail">
              <h2>PillarDAO’s growing ecosystem</h2>
              <h3>PillarDAO is BUIDLing!</h3>
              <p>All revenue from Pillar Project’s tools are directed to the PillarDAO treasury. The treasury was donated to the PillarDAO by Pillar Foundation</p>
              <div className="dao__ecosystem__detail__list">
                <a href="http://buidler.etherspot.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoEtherspotBuidler} alt="Etherspot BUIDLer" title="Etherspot BUIDLer" />
                </a>
                <a href="https://etherspot.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoEtherspotSdk} alt="Etherspot SDK" title="Etherspot SDK" />
                </a>
                <a href="https://dashboard.etherspot.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoEtherspotDashboard} alt="Etherspot Dashboard" title="Etherspot Dashboard" />
                </a>
                <a href="https://www.pillar.fi/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoPillar} alt="Pillar" title="Pillar" />
                </a>
                <a href="https://airdropme.io/?utm_source=plrstakinglp&utm_medium=website&utm_campaign=plr_staking" target="_blank" rel="noopener noreferrer">
                  <img src={logoAirdropme} alt="AirdropMe" title="AirdropMe" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default Dao;
