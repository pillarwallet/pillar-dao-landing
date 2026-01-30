import { daoLinks } from "@config/dao-links";
import socialDiscord from "@assets/images/social-discord.png";
import socialTwitter from "@assets/images/social-twitter.png";
import packageJson from '../../../package.json';
import styled from "styled-components";
import { Link } from "react-router-dom";

const Build = styled.div`
  padding: 0.1rem;
  font-size: 1rem;
  font-family: 'PTRootUIWebRegular', sans-serif;
  color: #fefefe;
`;

const SnapshotIcon = styled.svg`
  width: 36px;
  height: 36px;
  fill: white;
  transition: opacity 0.3s;
  display: block;

  &:hover {
    opacity: 0.7;
  }
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
                  <Link to="/voting" title="Voting">
                    <SnapshotIcon viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                      <path d="M196.993 117.038C196.315 115.213 194.579 114 192.638 114H136.577L168.914 50.804C169.93 48.816 169.406 46.3847 167.655 45.0033C166.81 44.3313 165.794 44 164.782 44C163.7 44 162.618 44.3827 161.75 45.134L127.64 74.744L59.6103 133.801C58.1432 135.075 57.6139 137.133 58.2917 138.957C58.9696 140.782 60.7013 142 62.642 142H118.703L86.3662 205.196C85.3495 207.184 85.8741 209.615 87.6244 210.997C88.4694 211.669 89.4861 212 90.4982 212C91.58 212 92.6617 211.617 93.5299 210.866L127.64 181.256L195.67 122.199C197.141 120.925 197.666 118.867 196.993 117.038Z"></path>
                    </SnapshotIcon>
                  </Link>
                </li>
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
