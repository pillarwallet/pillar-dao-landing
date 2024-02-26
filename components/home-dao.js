import React, { useEffect, useState } from "react";
import Link from "next/link";
import daoBg from "../assets/images/home-dao-bg.png";

const HomeDao = () => {
  return (
    <>
      <section className="home_dao" id="dao">
        <div className="container">
          <div className="home_dao__intro">
            <div className="home_dao__intro__text">
              <h2>What is <span>PillarDAO</span></h2>
              <p>PillarDAO builds, funds and explores Web3, multichain infrastructure and technology for a decentralized future. The DAO is collectively run and member-owned - anyone, anywhere can participate and influence the direction of the DAO. <br /><br /></p>
            </div>
            <div className="home_dao__intro__image">
              <img src={daoBg} alt="" />
            </div>
          </div>
          
          <div className="home_dao__statement">
            <div className="home_dao__statement__detail">
              <h3>Mission</h3>
              <p>PillarDAO’s mission is to utilize the funds in the PillarDAO treasury to fund:</p>
              <ul>
                <li>Worthy initiatives supporting DAO products.</li>
                <li>Marketing efforts for product distribution.</li>
                <li>Initiatives that upskill DAO members.</li>
                <li>Payment of contributors for their time and efforts.</li>
              </ul>
              <p>Our DAO governance structures ensure transparency and efficiency which will lead to a future where individuals control technological development rather than faceless corporations.</p>
            </div>
            <div className="home_dao__statement__detail">
              <h3>Vision</h3>
              <p>PillarDAO envisions a fully inclusive, non-custodial future, run in a trustless manner where all decisions and actions are transparent and community-led. A system that favours member involvement, financial freedom, and development. <br/><br/>Development not only of individual skills and competencies but also of cutting-edge technological instruments. PillarDAO strives with each decision to accomplish the steps required to take us forward for the betterment of humans and the systems we interact with. </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeDao;
