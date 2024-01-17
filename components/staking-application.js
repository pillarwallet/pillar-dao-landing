import React, { useEffect, useState } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';
import { ensureInitialized, isSupported, getRemoteConfig, getValue } from 'firebase/remote-config';
import { app } from 'pages/services/firebase';
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

      await ensureInitialized(remoteConfig)
        .then(() => {
          if (!isSupported) return;
          const stakeStartDate = getValue(remoteConfig, 'stakingStartTime');
          const stakeLockedTime = getValue(remoteConfig, 'stakingLockedStartTime');

          const now = new Date().getTime();
          const distance = stakeStartDate.asNumber() * 1000 - now;
          const lockedTimeDistance = stakeLockedTime.asNumber() * 1000 - now;
          setVisiblePLRStaking(distance < 0 && lockedTimeDistance > 0);
        })
        .catch((e) => {
          console.log('ensureInitialized Failed!', e);
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
              <span>Claim and unstake will be available at the end of this&nbsp;period</span>
            </h2>
          </div>

          {visiblePLRStaking && (
            <div className="staking_application__form">
              <div className="staking_application__form__detail">
                <WagmiProvider>
                  <PlrStakingBuilder defaultTransactionBlock={'PLR_STAKING_V2'} shouldDisplayForm={false} />
                </WagmiProvider>
              </div>
            </div>
          )}

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
                <input id="EMAIL" type="email" placeholder="E-mail" value={fields.EMAIL} onChange={handleFieldChange} />
                <button>Sign up</button>
              </form>
              {loading && 'Submitting'}
              {error && message}
              {success && message}
            </div>
          </div>

          {/* 
          <div className="staking_application__wrapper">
            <div></div>
            <div></div>
          </div> 
          */}
        </div>
      </section>
    </>
  );
};

export default StakingApplication;
