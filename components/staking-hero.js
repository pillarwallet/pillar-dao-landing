import React, { useEffect, useRef, useState } from 'react';
import { getRemoteConfig, ensureInitialized, getValue } from 'firebase/remote-config';
import { app } from '../services/firebase';

const StakingHero = () => {
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [totalETHStacked, setTotalETHStacked] = useState('0');
  const [currentAPY, setCurrentAPY] = useState('0');

  let interval = useRef();

  const startTimer = (startDate) => {
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = startDate * 1000 - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      if (distance < 0) {
        clearInterval(interval.current);
        document.getElementsByClassName('staking_hero__countdown')[0].style.display = 'none';
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
      }
    }, 1000);
  };

  useEffect(() => {
    (async () => {
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      remoteConfig.defaultConfig = {
        stakingStartTime: '1692806084',
      };
      await ensureInitialized(remoteConfig)
        .then(async () => {
          const stakeStartDate = getValue(remoteConfig, 'stakingStartTime');
          startTimer(stakeStartDate.asNumber());
        })
        .catch((e) => {
          console.log('ensureInitialized Failed!', e);
        });
    })();
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    try {
      fetch('https://beacon-chain-analytics.pillar-project.workers.dev')
        .then((res) => res.json())
        .then(({ staked_ether, apr }) => {
          if (staked_ether) {
            staked_ether = staked_ether.split(' ')[0];
            setTotalETHStacked(staked_ether);
          }
          if (apr) {
            setCurrentAPY(apr);
          }
        });
    } catch {
      //
    }
  }, []);

  return (
    <>
      <section className="staking_hero" id="home">
        <div className="container">
          <div className="staking_hero__headline">
            <h1>Earn ETH rewards for staking PLR token</h1>
          </div>
          {/* Current Stats */}
          <div className="staking_hero__stats">
            <div className="staking_hero__stats__detail">
              <p>Total ETH Staked</p>
              <h4 className="gradient_border">{totalETHStacked}</h4>
            </div>
            <div className="staking_hero__stats__detail">
              <p>Current APY</p>
              <h4 className="gradient_border">{currentAPY}</h4>
            </div>
            <p className="staking_hero__stats__status">Live°</p>
          </div>
          <div className="staking_hero__footnote">
            <p>
              No Reward Fees Apply! <span className="gradient_border">?</span>
            </p>
            <p className="staking_hero__footnote__tooltip gradient_border">
              Most staking programs charge a 'Reward Fee' which is charged as a % of your earned rewards. It is often
              10% of your rewards. PillarDAO charges no fees.
            </p>
          </div>

          <div className="staking_hero__countdown">
            <p>Time Left Until Staking Window&nbsp;Opens</p>
            <div className="staking_hero__countdown__detail">
              <ul>
                <li className="gradient_border">
                  <h2>{timerDays}</h2>
                </li>
                <h2>:</h2>
                <li className="gradient_border">
                  <h2>{timerHours}</h2>
                </li>
                <h2>:</h2>
                <li className="gradient_border">
                  <h2>{timerMinutes}</h2>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingHero;
