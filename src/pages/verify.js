import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

// contexts
import Web3ContextProvider from '../contexts/Web3Context';

// components
import Verify from '../components/Verify';

const Wrapper = styled.div``;

const HomePage = () => {
  return (
    <Web3ContextProvider chainId={1}>
      <Wrapper>
        <Verify />
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
    </Web3ContextProvider>
  )
};

export default HomePage
