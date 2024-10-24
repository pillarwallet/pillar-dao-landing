import { daoLinks } from "config/dao-links";
import React from "react";
import socialDiscord from "../assets/images/social-discord.png";
import socialTwitter from "../assets/images/social-twitter.png";
import packageJson from '../package.json';
import styled from "styled-components";

const Build = styled.div`
  padding: 0.1rem;
  font-size: 1rem;
  font-family: 'PTRootUIWebRegular', sans-serif;
  color: #fefefe;
`;

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
                <li>
                <Build>{packageJson.version}</Build>
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
