import { useEffect, useRef, useState } from 'react';
import { getRemoteConfig, ensureInitialized, getValue, fetchAndActivate } from 'firebase/remote-config';
import { app } from '../services/firebase';
import PlrDaoStakingBuilder from './plr-dao-buidler';

const StakingHero = () => {
  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [totalETHStacked, setTotalETHStacked] = useState('0');
  const [currentAPY, setCurrentAPY] = useState('0');

  let interval = useRef();
  const showCountdown = false; //set visibility of countdown

  const startTimer = (startDate) => {
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = startDate * 1000 - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      if (distance < 0) {
        clearInterval(interval.current);
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
        stakingLockedStartTime: '1693666484',
      };
      await ensureInitialized(remoteConfig);
      await fetchAndActivate(remoteConfig)
        .then(() => {
          // const stakeStartDate = getValue(remoteConfig, 'stakingStartTime');
          const stakeLockedTime = getValue(remoteConfig, 'stakingLockedStartTime');
          startTimer(stakeLockedTime.asNumber());
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
            <h1>Unstake your PLR tokens</h1>
          </div>
          <div className="staking_hero__dapp">
            <PlrDaoStakingBuilder defaultTransactionBlock={'PLR_DAO_STAKE'} shouldDisplayForm={true} />
            <p>Supported browsers: Chrome, Firefox <br />Supported wallet: MetaMask</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingHero;
