import React, { useEffect, useState } from "react";
import pillarIcon from "../assets/images/pillar-icon.png";
const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <img className="about__icon" src={pillarIcon} alt="" />
          <div className="about__headline">
            <h2>All users who’ve staked PLR during the staking window will share the rewards proportionally, according to their staked percentage of the PLR pool.</h2>
          </div>

          {/* Stake Details */}
          <div className="about__stake">
            <div className="about__stake__detail">
              <p>Total vaulted PLR</p>
              <h3>9,000,000 PLR</h3>
            </div>
            <div className="about__stake__detail">
              <p>% filled</p>
              <h3>10% filled</h3>
            </div>
            <div className="about__stake__detail">
              <p>Total Rewards Accrued</p>
              <h3>15 ETH</h3>
            </div>
            <div className="about__stake__detail">
              <p>Stakers</p>
              <h3>45</h3>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default About;
