import Layout from '@components/layout';
import Header from '@components/header';
import UnstakingHero from '@components/unstaking-hero';
import UnstakingAbout from '@components/unstaking-about';
import SwapFaq from '@components/swap-faq';
import Footer from '@components/footer';
const Index = () => {
  return (
    <Layout pageTitle="PillarDAO - Unstaking assistance">
      <Header />
      <UnstakingHero />
      <UnstakingAbout />
      <Footer />
    </Layout>
  );
};

export default Index;
