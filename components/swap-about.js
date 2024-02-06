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
                ❗️only send PLR tokens from L2 compatible wallets, Metamask or Pillar V2 smart wallet.
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
              <div className="swap__statement__rightside__detail" style={{ marginTop: 20 }}>
                <h3>Option 3: Purchasing PLR on Polygon using Quick swap</h3>
                <p>Purchasing PLR on Polygon using Quick swap where you can exchange any Polygon token against PLR</p>
                <Link
                  href="https://quickswap.exchange/#/swap/v3?currency0=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&currency1=0xa6b37fc85d870711c56fbcb8afe2f8db049ae774&swapIndex=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="swap__button"
                >
                  Use Quick swap
                </Link>
              </div>
            </div>
          </div>
          <div className="swap_about_info_content">
            <h4>
              As soon as the PLR token transfer is completed, take the next step by visiting{' '}
              <Link href="/staking#home" target="_blank" rel="noopener noreferrer">
                this page
              </Link>{' '}
              to participate in the PillarDAO staking and start getting rewards.
            </h4>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingAbout;
