import styled, { css, keyframes } from 'styled-components';

import { getExplorerContractLink, getOpenSeaCollectionUrl } from '../services/contract';
import { isMainnet } from '../utils/common';

import etherscanLogo from '../assets/images/logo-etherscan.png';
import openseaLogo from '../assets/images/logo-opensea.png';
import polygonLogo from '../assets/images/logo-polygon.svg';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 25px 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  align-items: center;
  
  @media (max-width: 700px) {
    padding: 25px 15px;
  }
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
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  ${({ noMarginLeft }) => !noMarginLeft && `margin-left: 30px;`}
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

const TopIconLinks = () => {
  return (
    <Wrapper>
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
    </Wrapper>
  )
};

export default TopIconLinks;
