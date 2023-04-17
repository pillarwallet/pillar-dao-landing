import React, { useEffect, useRef, useState } from "react";
const Hero = () => {

  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');

  let interval = useRef();

  const startTimer = () => {
    const countdownDate = new Date('May 15, 2023 14:00:00 UTC').getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
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
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  });


  return (
    <>
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero__headline">
            <h1>Earn ETH rewards for staking PLR token</h1>
          </div>

          {/* Current Stats */}
          <div className="hero__stats">
            <div className="hero__stats__detail">
              <p>Total ETH Staked</p>
              <h4 className="gradient_border">16,183,945</h4>
            </div>
            <div className="hero__stats__detail">
              <p>Current APY</p>
              <h4 className="gradient_border">5.2%</h4>
            </div>
            <p className="hero__stats__status">Live°</p>
          </div>

          {/* Countdown */}
          <div className="hero__countdown">
            <p>Time Left Until Staking Window Opens</p>
            <div className="hero__countdown__detail">
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

export default Hero;
