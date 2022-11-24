import styled, { css, keyframes } from 'styled-components';

import { getExplorerContractLink, getOpenSeaCollectionUrl } from '../services/contract';
import { isMainnet } from '../utils/common';

import discordLogo from '../assets/images/logo-etherscan.png';
import etherscanLogo from '../assets/images/logo-etherscan.png';
import openseaLogo from '../assets/images/logo-opensea.png';
import polygonLogo from '../assets/images/logo-polygon.svg';

const Wrapper = styled.div`
  position: relative;
  padding: 25px 40px;
  width: 100%;
  background: #230134;
  
  @media (max-width: 700px) {
    padding: 25px 20px;
  }
`;

const Footer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`;


const SocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const spinAnimation = keyframes`
  100% { transform: rotate(360deg); } 
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  ${({ noMarginLeft }) => !noMarginLeft && `margin-left: 20px;`}
  background: ${({ color }) => color};

  ${({ noHoverOpacity }) => !noHoverOpacity && `
    &:hover {
      opacity: 0.5;
    }
  `}

  @media (max-width: 700px) {
    transform: scale(0.7);
    margin: 0 10px;
  }
  
  & > img {
    height: ${({ imageLink }) => imageLink ? '100%' : '50%'};
  }

  ${({ rotateAnimation }) => rotateAnimation && css`
    &:hover img {
      animation: ${spinAnimation} 1s linear infinite;
    }
  `}
`;

const BottomFooter = () => {
  return (
    <Wrapper>
      <Footer>
        <SocialLinks>
          <SocialLink title="Pillar DAO membership on OpenSea" href={getOpenSeaCollectionUrl()} target="_blank" imageLink color="#2081e2">
            <img src={openseaLogo} alt="pillar dao opensea" title="Pillar DAO membership on OpenSea" />
          </SocialLink>
          {isMainnet && (
            <SocialLink title="Pillar DAO contract on Polygonscan" href={getExplorerContractLink()} target="_blank" color="#fff">
              <img src={polygonLogo} alt="pillar dao polygonscan" title="Pillar DAO contract on Polygonscan" />
            </SocialLink>
          )}
          {!isMainnet && (
            <SocialLink title="Pillar DAO contract on Etherscan" href={getExplorerContractLink()} target="_blank" color="#fff">
              <img src={etherscanLogo} alt="pillar dao etherscan" title="Pillar DAO contract on Etherscan" />
            </SocialLink>
          )}
        </SocialLinks>
      </Footer>
    </Wrapper>
  )
};

export default BottomFooter;
