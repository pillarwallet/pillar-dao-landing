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
              <p>PillarDAO builds, funds and explores Web3, multichain infrastructure and technology for a decentralized future. The DAO is collectively run and member-owned - anyone, anywhere can participate and influence the direction of the DAO. <br /><br /><strong>PillarDAO is completely decentralized and the community owns and governs <Link href="https://www.pillar.fi/?utm_source=pillar_website&utm_medium=page&utm_campaign=pillar_dao" target="_blank" rel="noopener noreferrer">
                Pillar Wallet
              </Link>. All profits from this product (current & future) are routed directly into the DAO treasury.</strong></p>
            </div>
            <div className="home_dao__intro__image">
              <img src={daoBg} alt="" />
            </div>
          </div>
          
          <div className="home_dao__statement">
            <div className="home_dao__statement__detail">
              <h3>Mission</h3>
              <p>The PillarDAO’s mission is to decentralize governance, explore and build worthy initiatives and fund Web3, multichain infrastructure and technology products. As advocates for the community, the PillarDAO is collectively run, member-owned and governs the Pillar Project Association. All profits from  DAO products (current & future) are routed directly into the DAO treasury. 
PillarDAO is to utilize the funds in the PillarDAO treasury to fund:</p>
              <ul>
                <li>Worthy initiatives supporting DAO products.</li>
                <li>Marketing efforts for product distribution.</li>
                <li>Initiatives that upskill DAO members.</li>
                <li>Payment of contributors for their time and efforts.</li>
              </ul>
              <p>Our DAO governance ensures a future where individuals collectively lead technological development rather than faceless corporations.</p>
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
