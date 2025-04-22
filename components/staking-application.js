/* Staking for Pillar DAO. For staking PLR for DAO nft membership, see home-governance.js, plr-dao-buidler.js */
import { useEffect, useState } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';
import Link from 'next/link';
import { ensureInitialized, getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';
import { app } from '../services/firebase';
import PlrStakingBuilder from './staking-plr-buidler';

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
              This concludes the first PillarDAO staking pool. <br/> <span>We would like to thank everybody for participating. PLR and WETH rewards are returned on the Polygon chain. If you require assistance </span> moving PLR tokens and rewards from Polygon to Ethereum please <Link href="/unstaking"> follow&nbsp;the guide</Link> <span>.</span>
            </h2>
          </div>

          <div className="staking_application_cards__detail">
            <div className="staking_application__detail">
              <p>Continue to <a href="https://x.com/pillar_dao" target="_blank">follow us</a> to get notified when details are available for the second round of staking.</p>
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
                <h3>Sign up to receive updates</h3>
                <p>on future PillarDAO community programs</p>
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
                  <button type="submit">Sign up</button>
                </form>
                {loading && 'Submitting'}
                {error && message}
                {success && message}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default StakingApplication;
