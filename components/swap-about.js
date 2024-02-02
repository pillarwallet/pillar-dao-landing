import React from 'react';
import Link from 'next/link';

const StakingAbout = () => {
  return (
    <>
      <section className="swap_about" id="about">
        <div className="container">
          <div className="swap__statement">
            <div className="swap__statement__detail">
              <h3>
                Option 1: PillarDAO
                <br />
                Cross-Chain assistance*
              </h3>
              <p>
                PillarDAO will be happy to assist you to cross-chain PLR from Ethereum to Polygon. It's about 65%
                cheaper than via the official Polygon bridge, and the DAO will provide you a small amount of MATIC for
                transactional gas.
                <br />
                <br />
                ❗️only send PLR tokens from L2 compatible wallets, Metamask, Pillar v1, Pillar v2 smart wallet.
              </p>
              <Link
                href="https://forms.gle/i5miGsEt7xMf5Lby5"
                target="_blank"
                rel="noopener noreferrer"
                className="swap__button"
              >
                Submit your request
              </Link>
              <h4>*Available only for PillarDAO staking participants</h4>
            </div>
            <div className="swap__statement__right__content">
              <div className="swap__statement__rightside__detail">
                <h3>Option 2: Polygon’s official bridge*</h3>
                <Link
                  href="https://portal.polygon.technology/bridge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="swap__button"
                >
                  Use Polygon’s official bridge
                </Link>
                <h4>*Please be advised that utilizing bridging services may result in additional gas costs.</h4>
              </div>
              <div className="swap__statement__rightside__detail">
                <h3>Option 3: Purchasing PLR on Polygon using Quick swap</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingAbout;
