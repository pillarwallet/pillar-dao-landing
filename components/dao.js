import React, { useEffect, useState } from "react";
import stakeIcon from "../assets/images/stake-icon.png";
import mintIcon from "../assets/images/mint-icon.png";
import communityIcon from "../assets/images/community-icon.png";
import ecosystemLogo from "../assets/images/dao-ecosystem-logos.png";

const Dao = () => {
  return (
    <>
      <section className="dao" id="about">
        
        <div className="dao__staking">
          <div className="container">
            <div className="dao__staking__headline">
              <h2>How <span>PillarDAO Staking</span> Works</h2>
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
              <p>The Ethereum Foundation has stated that withdrawals of staked ETH and rewards will not be available for 12 months after The Merge. With this in mind, all staked PLR will be locked until after this period has completed. Then the personally set stake period will commence. <br/><br/>Once the personally set period has concluded, ETH rewards will be open for withdrawal and un-staking PLR tokens can also be done.</p>
            </div>
            <div className="dao__faq__detail">
              <h3>When can I claim <br/> my ETH?</h3>
              <p>Withdraw functionality is expected to be included in the next network upgrade, named Shanghai. This network upgrade is estimated for the first half of 2023, subject to change until completed. After the Shanghai update, stakers will then be able to withdraw their rewards from their validator balance if they choose.</p>
            </div>
          </div>
        </div>

        <div className="dao__ecosystem">
          <div className="container">
            <div className="dao__ecosystem__detail">
              <h2>PillarDAO’s growing ecosystem</h2>
              <h3>PillarDAO is BUIDLing!</h3>
              <p>All revenue from Pillar Project’s tools are directed to the PillarDAO treasury. The treasury was donated to the PillarDAO by Pillar Foundation</p>
              <img src={ecosystemLogo} alt="Etherspot BUIDLer | Etherspot SDK | Etherspot Dashboard | Pillar | AirdropMe" title="Etherspot BUIDLer | Etherspot SDK | Etherspot Dashboard | Pillar | AirdropMe" />
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default Dao;
