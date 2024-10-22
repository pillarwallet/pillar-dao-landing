import { daoLinks } from "config/dao-links";
import React from "react";
import Link from "next/link";
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
                  <Link href="https://www.pillardao.org/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="footer__social">
              <ul className="footer__social__icons">
                <li>
                  <Link href={daoLinks.DAO_SOCIAL_DISCORD} target="_blank" rel="noopener noreferrer">
                    <img src={socialDiscord} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href={daoLinks.DAO_SOCIAL_TWITTER_X} target="_blank" rel="noopener noreferrer">
                    <img src={socialTwitter} alt="" />
                  </Link>
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
