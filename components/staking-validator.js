import React from 'react';
import PlrDaoStakingBuilder from './plr-dao-buidler';

const StakingValidator = () => {
  return (
    <>
      <section className="staking_application" id="application">
        <div className="container">
          <div className="staking_application__headline">
            <h2>
              All Staked Funds Will Be Locked for 52&nbsp;Weeks.{' '}
              <span>ETH Rewards will be available on a quarterly&nbsp;basis.</span>
            </h2>
          </div>

          <div className="staking_application__form">
            <div className="staking_application__form__detail">
              <h3>PLR staking will be open for 1&nbsp;month</h3>
              <WagmiProvider>
                <PlrDaoStakingBuilder defaultTransactionBlock={'PLR_STAKING_V2'} shouldDisplayForm={false} />
              </WagmiProvider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingValidator;
