import React from 'react';
import Link from 'next/link';

const StakingAbout = () => {
  return (
    <>
      <section className="swap__faq" id="about">
        <div className="container">
          <h1>FAQ</h1>
        </div>
        {/* <div className="swap__faq__detail">
          <h3>What is the difference between Pillar v1 and Pillar v2 smart wallet?</h3>
          <div className="swap__faq__detail__text">
            <p>
              The Ethereum Foundation has stated that withdrawals of staked ETH and rewards will not be available for 12
              months after The Merge. With this in mind, all staked PLR will be locked until after this period has
              completed. Then the personally set stake period will commence.
              <br />
              <br />
              Once the personally set period has concluded, ETH rewards will be open for withdrawal and un-staking PLR
              tokens can also be done.
            </p>
          </div>
        </div>
        <div className="swap__faq__detail">
          <h3>How do I connect my wallet to stake?</h3>
          <div className="swap__faq__detail__text">
            <p>
              Withdraw functionality is expected to be included in the next network upgrade, named Shanghai. This
              network upgrade is estimated for the first half of 2023, subject to change until completed. After the
              Shanghai update, stakers will then be able to withdraw their rewards from their validator balance if they
              choose.
            </p>
          </div>
        </div> */}
        <div className="swap__faq__detail">
          <h3>Why is staking only on Polygon?</h3>
          <div className="swap__faq__detail__text">
            <p>
              In response to potential high gas costs on Ethereum, PillarDAO has decided to host the PLR staking program
              on Polygon.
            </p>
          </div>
        </div>
        <div className="swap__faq__detail">
          <h3>Is it safe to use option #1 “PillarDAO Cross-Chain assistance”?</h3>
          <div className="swap__faq__detail__text">
            <p>
              Cross-chain assistance allows you to send and receive your tokens for minimal gas vs bridge contracts.
              After the transaction verification, the DAO will transfer PLR on Polygon to the address provided in{' '}
              <a href="https://forms.gle/i5miGsEt7xMf5Lby5" to="#" target="_blank" rel="noopener noreferrer">
                the request form
              </a>{' '}
              along with 1 Matic for gas on Polygon. This process does require manual processing of sending tokens and a
              short delay time.
            </p>
          </div>
        </div>
        <div className="swap__faq__detail">
          <h3>What happens if I don’t get my tokens back on Polygon?</h3>
          <div className="swap__faq__detail__text">
            <p>
              If you don't see the tokens in your wallet, check your wallet address on https://polygonscan.com/. Often
              wallets require you to manually identify tokens. One way you can do this is on the PLR token contract
              page: https://polygonscan.com/token/
              <br />
              0xa6b37fc85d870711c56fbcb8afe2f8db049ae774 “Click More” upper right corner, select “Add token to Metamask
              (web3)”. If you have followed the above steps and don’t see the tokens on the Polygon scan even after 24
              hours, please contract the DAO at{' '}
              <a href="mailto:dpo@pillardao.org" to="#" target="_blank" rel="noopener noreferrer">
                dpo@pillardao.org
              </a>
              . You will also have a transaction ID# from when you sent PLR and this will serve as Receipt for where
              your tokens were received. It's important to always verify your address is correct when sending tokens.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingAbout;
