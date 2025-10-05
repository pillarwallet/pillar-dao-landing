import Layout from '@components/shared/layout';
import Header from '@components/shared/header';
import SwapHero from '@components/swap/hero-section';
import SwapAbout from '@components/swap/about-section';
import SwapFaq from '@components/swap/faq-section';
import Footer from '@components/shared/footer';
const Index = () => {
  return (
    <Layout pageTitle="PillarDAO Swap - PLR Ethereum to Polygon ">
      <Header />
      <SwapHero />
      <SwapAbout />
      <SwapFaq />
      <Footer />
    </Layout>
  );
};

export default Index;
