import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

// utils
import { colors, fonts } from '../utils/theme';


const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'Euclid Circular B';
      src: url('fonts/EuclidCircularB/EuclidCircularB-Regular.woff2') format('woff2'),
      url('fonts/EuclidCircularB/EuclidCircularB-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
  }
    
  @font-face {
      font-family: 'Euclid Circular B';
      src: url('fonts/EuclidCircularB/EuclidCircularB-Bold.woff2') format('woff2'),
            url('fonts/EuclidCircularB/EuclidCircularB-Bold.woff') format('woff');
      font-weight: 600;
      font-style: normal;
  }
    
  @font-face {
      font-family: 'Archia';
      src: url('fonts/Archia/archia-regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
  }

  body {
    background: ${colors.violet};
    font-family: ${fonts.primary}, sans;
    color: #fff;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const hostname = process.env.REACT_APP_HOSTNAME ?? '';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>PillarDAO Membership | pillar.fi</title>

      <meta name="viewport" content="width=device-width, initial-scale=1"/>

      <link rel="icon" href={`${hostname}/favicon.ico`} />
      <link rel="apple-touch-icon" href={`${hostname}/logo192.png`} />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />

      <link rel="manifest" href={`${hostname}/manifest.json`} />
      <meta name="theme-color" content="#000000"/>
    </Head>
    <GlobalStyle />
    <Component {...pageProps} />
  </>
);

export default App;
