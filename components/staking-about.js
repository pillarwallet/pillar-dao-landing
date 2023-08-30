import React, { useEffect, useState } from "react";
import pillarIcon from "../assets/images/pillar-icon.png";
const StakingAbout = () => {
  return (
    <>
      <section className="staking_about" id="about">
        <div className="container">
          <img className="staking_about__icon" src={pillarIcon} alt="" />
          <div className="staking_about__headline">
            <h2>All users who’ve staked PLR during the staking window will share the rewards proportionally, according to their staked percentage of the PLR pool.</h2>
          </div>

          {/* Stake Details */}
          {/* <div className="staking_about__stake">
            <div className="staking_about__stake__detail">
              <p>Total vaulted PLR</p>
              <h3>6,000,000 PLR</h3>
            </div>
            <div className="staking_about__stake__detail">
              <p>% filled</p>
              <h3>85% filled</h3>
            </div>
            <div className="staking_about__stake__detail">
              <p>Total Rewards Accrued</p>
              <h3>15 ETH</h3>
            </div>
            <div className="staking_about__stake__detail">
              <p>Stakers</p>
              <h3>85</h3>
            </div>
          </div> */}

        </div>
      </section>
    </>
  );
};

export default StakingAbout;
