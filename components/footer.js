import React, { useEffect, useState } from "react";
import Link from "next/link";
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
                  <Link href="https://www.pillar.fi/privacy-policy/">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="footer__social">
              <ul className="footer__social__icons">
                <li>
                  <Link href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer">
                    <img src={socialDiscord} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/c/PillarProject" target="_blank" rel="noopener noreferrer">
                    <img src={socialyoutube} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="https://twitter.com/PillarWallet" target="_blank" rel="noopener noreferrer">
                    <img src={socialTwitter} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="https://t.me/pillarofficial" target="_blank" rel="noopener noreferrer">
                    <img src={socialTelegram} alt="" />
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/pillarwallet" target="_blank" rel="noopener noreferrer">
                    <img src={socialGithub} alt="" />
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
