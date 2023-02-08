import React, { useEffect, useState } from "react";
import socialDiscord from "../assets/images/social-discord.png";
import socialTwitter from "../assets/images/social-twitter.png";
import socialTelegram from "../assets/images/social-telegram.png";

const Footer = () => {
  return (
    <>
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__links">
              <a href="#" target="_blank" rel="noopener noreferrer">Membership dApp</a>
              <a href="#" target="_blank" rel="noopener noreferrer">PillarDAO forum</a>
            </div>
            <div className="footer__social">
              <a href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer">
                <img src={socialDiscord} alt="" />
              </a>
              <a href="https://twitter.com/PillarWallet" target="_blank" rel="noopener noreferrer">
                <img src={socialTwitter} alt="" />
              </a>
              <a href="https://t.me/pillarofficial" target="_blank" rel="noopener noreferrer">
                <img src={socialTelegram} alt="" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
