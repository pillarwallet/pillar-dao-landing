import Layout from '@components/shared/layout';
import Header from '@components/shared/header';
import UnstakingHero from '@components/staking/unstaking-hero-section';
import UnstakingAbout from '@components/staking/unstaking-about-section';
import SwapFaq from '@components/swap/faq-section';
import Footer from '@components/shared/footer';
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