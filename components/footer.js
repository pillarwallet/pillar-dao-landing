import React, { useEffect, useState } from "react";
import socialDiscord from "../assets/images/social-discord.png";
import socialyoutube from "../assets/images/social-youtube.png";
import socialTwitter from "../assets/images/social-twitter.png";
import socialTelegram from "../assets/images/social-telegram.png";
import socialGithub from "../assets/images/social-github.png";
import footerMTV from "../assets/images/footer-mtv.png";
import footerETH from "../assets/images/footer-eth.png";

const Footer = () => {
  return (
    <>
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__links">
              <ul>
                <li>
                  <a href="https://www.pillar.fi/cookie-policy/">Cookie Policy</a>
                </li>
                <li>
                  <a href="https://www.pillar.fi/data-protection-policy/">Data Protection Policy</a>
                </li>
                <li>
                  <a href="https://www.pillar.fi/privacy-policy/">Privacy Policy</a>
                </li>
                <li>
                  <a href="https://help.pillarproject.io/en/" target="_blank" rel="noopener noreferrer">Help</a>
                </li>
              </ul>
              <ul>
                <li>
                  <a href="mailto:pr@pillar.fi">Press/media inquiries</a>
                </li>
                <li>
                  <a href="https://www.pillar.fi/media-kit/">Media Kit</a>
                </li>
                <li>
                  <a href="https://link3.to/pillar" target="_blank" rel="noopener noreferrer">Events</a>
                </li>
                <li>
                  <a href="https://hackerone.com/pillarproject" target="_blank" rel="noopener noreferrer">Pillar Bug Bounty</a>
                </li>
              </ul>
            </div>
            <div className="footer__social">
              <ul className="footer__social__icons">
                <li>
                  <a href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer">
                    <img src={socialDiscord} alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/c/PillarProject" target="_blank" rel="noopener noreferrer">
                    <img src={socialyoutube} alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/PillarWallet" target="_blank" rel="noopener noreferrer">
                    <img src={socialTwitter} alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://t.me/pillarofficial" target="_blank" rel="noopener noreferrer">
                    <img src={socialTelegram} alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/pillarwallet" target="_blank" rel="noopener noreferrer">
                    <img src={socialGithub} alt="" />
                  </a>
                </li>
              </ul>
              <ul className="footer__social__logos">
                <li>
                  <a href="https://messari.io/asset/pillar/profile" target="_blank" rel="noopener noreferrer">
                    <img src={footerMTV} alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://www.pillar.fi/">
                    <img src={footerETH} alt="" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
