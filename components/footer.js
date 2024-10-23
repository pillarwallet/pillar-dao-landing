import { daoLinks } from "config/dao-links";
import React from "react";
import socialDiscord from "../assets/images/social-discord.png";
import socialTwitter from "../assets/images/social-twitter.png";

const Footer = () => {
  return (
    <>
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__links">
              <ul>
                <li>
                  <a href="https://www.pillardao.org/privacy-policy">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div className="footer__social">
              <ul className="footer__social__icons">
                <li>
                  <a href={daoLinks.DAO_SOCIAL_DISCORD} target="_blank" rel="noopener noreferrer">
                    <img src={socialDiscord} alt="Discord" />
                  </a>
                </li>
                <li>
                  <a href={daoLinks.DAO_SOCIAL_TWITTER_X} target="_blank" rel="noopener noreferrer">
                    <img src={socialTwitter} alt="Twitter" />
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
