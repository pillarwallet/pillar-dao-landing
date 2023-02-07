import React, { useEffect, useState } from "react";
const Hero = () => {
  return (
    <>
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero__headline">
            <h1>Earn ETH rewards for staking PLR token</h1>
          </div>

          {/* Current Stats */}
          <div className="hero__stats">
            <div className="hero__stats__detail">
              <p>Total ETH Staked</p>
              <h4 className="gradient_border">16,183,945</h4>
            </div>
            <div className="hero__stats__detail">
              <p>Current APY</p>
              <h4 className="gradient_border">5.2%</h4>
            </div>
            <p className="hero__stats__status">Live°</p>
          </div>

          {/* Countdown */}
          <div className="hero__countdown">
            <p>Time Left Until Staking Window Opens</p>
            <div className="hero__countdown__detail">
              <ul>
                  <li className="gradient_border">
                    <h2>00</h2>
                  </li>
                  <h2>:</h2>
                  <li className="gradient_border">
                    <h2>00</h2>
                  </li>
                  <h2>:</h2>
                  <li className="gradient_border">
                    <h2>00</h2>
                  </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Hero;
