import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

// contexts
import Web3ContextProvider from '../contexts/Web3Context';
import StakeContextProvider from '../contexts/StakeContext';

// components
import Hero from '../components/Hero';
import TopIconLinks from '../components/TopIconLinks';
import TopHeader from '../components/TopHeader';
import BottomFooter from '../components/BottomFooter';

const Wrapper = styled.div``;

const HomePage = () => {
  return (
    <Web3ContextProvider chainId={4}>
        <StakeContextProvider>
            <Wrapper>
              <TopHeader />
              <Hero />
              <BottomFooter />
            </Wrapper>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              rtl={false}
              draggable={false}
              hideProgressBar
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              pauseOnHover
            />
        </StakeContextProvider>
    </Web3ContextProvider>
  )
};

export default HomePage
