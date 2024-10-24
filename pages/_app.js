import WagmiProvider from '@components/WagmiProvider';
import '@css/normalize.css';
import '@css/style.css';
import '@css/swap.css';

export default function App({ Component, pageProps }) {
  return (
    <WagmiProvider>
      <Component {...pageProps} />
    </WagmiProvider>
  );
}
