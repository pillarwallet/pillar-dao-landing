/* Staking for Pillar DAO. For staking PLR for a DAO nft, see home-governance.js, plr-dao-buidler.js */
import React, { useEffect, useState } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';
import Link from 'next/link';
import { ensureInitialized, getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';
import { app } from '../services/firebase';
import WagmiProvider from '../components/WagmiProvider';
import PlrStakingBuilder from './plr-staking-buidler';

const StakingApplication = () => {
  const mailchimpURL =
    'https://pillarproject.us14.list-manage.com/subscribe/post?u=0056162978ccced9e0e2e2939&amp;id=a32643eea2&amp;f_id=00edc2e1f0';
  const { loading, error, success, message, handleSubmit } = useMailChimpForm(mailchimpURL);
  const { fields, handleFieldChange } = useFormFields({ EMAIL: '' });

  const [visiblePLRStaking, setVisiblePLRStaking] = useState(false);

  useEffect(() => {
    (async () => {
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      remoteConfig.defaultConfig = {
        stakingStartTime: '1692806084',
        stakingLockedStartTime: '1693666484',
      };
      await ensureInitialized(remoteConfig);
      await fetchAndActivate(remoteConfig)
        .then(() => {
          const stakeStartDate = getValue(remoteConfig, 'stakingStartTime');
          const stakeLockedTime = getValue(remoteConfig, 'stakingLockedStartTime');

          const now = new Date().getTime();
          const distance = stakeStartDate.asNumber() * 1000 - now;
          const lockedTimeDistance = stakeLockedTime.asNumber() * 1000 - now;
          setVisiblePLRStaking(distance < 0 && lockedTimeDistance > 0);
        })
        .catch((err) => {
          console.log('fetchAndActivate Failed!', err);
        });
    })();
  });

  return (
    <>
      <section className="staking_application" id="application">
        <div className="container">
          <div className="staking_application__headline">
            <h2>
              All Staked Funds Will Be Locked for 52&nbsp;Weeks.{' '}
              <span>(12 months) Claim and unstake will be available at the end of this &nbsp;period</span>
            </h2>
          </div>

          <div className="staking_application_cards__detail">
            <div className="staking_application__detail">
              <p>
                To enhance your staking experience with us, we have fine-tuned the PLR staking program to launch on
                Polygon which better meets your needs and reduces overall fees. All ETH rewards will be distributed at
                the end of the staking period in Wrapped ETH (WETH).
                <br />
                <br />
                Staking is only supported for key-based wallets (EOA) such as MetaMask. If you hold PLR tokens on a
                smart contract wallet, please transfer them before staking.
                <br />
                <br /> Important: The Pillar staking program is only available for PLR tokens on the Polygon network. If
                you possess PLR tokens on Ethereum, please follow the guide to move them{' '}
                <Link href="/plr_ethereum_to_polygon#staking">here</Link>.
              </p>
            </div>
          </div>

          {visiblePLRStaking ? (
            <div className="staking_application__form">
              <div className="staking_application__form__detail">
                <PlrStakingBuilder defaultTransactionBlock={'PLR_STAKING_V2'} shouldDisplayForm={false} />
              </div>
            </div>
          ) : (
            <div className="staking_application__form">
              <div className="staking_application__form__detail">
                <h3>Sign up to receive updates on the PLR staking campaign</h3>
                {/* <p>Sign up to receive updates on the PLR staking campaign</p> */}
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(fields);
                  }}
                >
                  <input
                    id="EMAIL"
                    type="email"
                    placeholder="E-mail"
                    value={fields.EMAIL}
                    onChange={handleFieldChange}
                  />
                  <button>Sign up</button>
                </form>
                {loading && 'Submitting'}
                {error && message}
                {success && message}
              </div>
            </div>
          )}

          <div className="staking_application_cards__detail">
            <div className="staking_application__detail">
              <p>
                If you currently hold PLR tokens on the Ethereum network, there's no need to be concerned. You can
                seamlessly swap them for PLR tokens on Polygon <Link href="/plr_ethereum_to_polygon#staking">here</Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingApplication;
