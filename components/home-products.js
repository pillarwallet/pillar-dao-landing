import React, { useEffect, useState } from "react";
import Link from "next/link";
import logoEtherspotSdk from "../assets/images/logo-etherspot-sdk.png";
import logoEtherspotBuidler from "../assets/images/logo-etherspot-buidler.png";
import logoTransactionKit from "../assets/images/logo-transactionkit.png";
import logoPillar from "../assets/images/logo-pillar.png";
import logoAirdropme from "../assets/images/logo-airdropme.png";
const HomeProducts = () => {
  return (
    <>
      <section className="home_products" id="products">
        <div className="container">
          <div className="home_products__detail">
            <h2><span>PillarDAO</span> Products</h2>
            <div className="home_products__detail__list">
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
      </section>
    </>
  );
};

export default HomeProducts;
