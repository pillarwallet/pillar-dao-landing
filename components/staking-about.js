import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import pillarIcon from '../assets/images/pillar-icon.png';
import etherspot from '../services/etherspot';
import { getRemoteConfig, fetchAndActivate, ensureInitialized, getValue } from 'firebase/remote-config';
import { app } from '../services/firebase';

const StakingAbout = () => {
  const [stakingData, setStakingData] = useState(null);

  useEffect(() => {
    (async () => {
      const randomWallet = ethers.Wallet.createRandom();
      await etherspot.init(randomWallet.privateKey);

      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      remoteConfig.defaultConfig = {
        plrStakingContract: '0x4fa3d9Cf11Dc94e5E0f3BCCa980aA8FB3a0d27f3',
      };

      await ensureInitialized(remoteConfig);
      await fetchAndActivate(remoteConfig)
        .then(async () => {
          const contractAddress = getValue(remoteConfig, 'plrStakingContract');
          const data = await etherspot.getPLRStakingData(contractAddress.asString());
          setStakingData(data);
        })
        .catch((e) => {
          console.log('fetchAndActivate Failed!', e);
        });
    })();
  }, []);

  return (
    <>
      <section className="staking_about" id="about">
        <div className="container">
          <img className="staking_about__icon" src={pillarIcon} alt="" />
          <div className="staking_about__headline">
            <h2>
              All users who’ve staked PLR during the staking window will share the rewards proportionally, according to
              their staked percentage of the PLR pool.
            </h2>
          </div>

          {/* Stake Details */}
          <div className="staking_about__stake">
            <div className="staking_about__stake__detail">
              <p>Total vaulted PLR</p>
              <h3>{stakingData?.totalValuedPLR || 0} PLR</h3>
            </div>
            <div className="staking_about__stake__detail">
              <p>% filled</p>
              <h3>{stakingData?.percentage || 0}% filled</h3>
            </div>
            {/* <div className="staking_about__stake__detail">
              <p>Total Rewards Accrued</p>
              <h3>15 ETH</h3>
            </div> */}
            <div className="staking_about__stake__detail">
              <p>Stakers</p>
              <h3>{stakingData?.stakers || 0}</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingAbout;
