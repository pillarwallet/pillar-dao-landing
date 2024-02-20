import React from 'react';
import Layout from '@components/layout';
import Header from '@components/header';
import SwapHero from '@components/swap-hero';
import SwapAbout from '@components/swap-about';
import SwapFaq from '@components/swap-faq';
import Footer from '@components/footer';
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
