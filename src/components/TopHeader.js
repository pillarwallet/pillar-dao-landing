import styled, { css, keyframes } from 'styled-components';

import pillardaoLogo from '../assets/images/logo-pillar-dao.png';

const Wrapper = styled.div`
  position: relative;
  padding: 25px 40px;
  width: 100%;
  background: #6D009F;
  
  @media (max-width: 700px) {
    padding: 25px 20px;
  }
`;

const Header = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`;

const TopHeader = () => {
  return (
    <Wrapper>
      <Header>
        <img src={pillardaoLogo} alt="Pillar DAO" title="Pillar DAO" />
      </Header>
    </Wrapper>
  )
};

export default TopHeader;
