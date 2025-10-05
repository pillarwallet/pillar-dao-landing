import Layout from "@components/shared/layout";
import Header from "@components/shared/header";
import HomeHero from "@components/home/hero-section";
import HomeDao from "@components/home-dao";
import HomeProducts from "@components/home-products";
import HomeGovernance from "@components/home/governance-section";
import HomeAbout from "@components/home-about";
import Footer from "@components/shared/footer";
const Index = () => {
  return (
    <Layout pageTitle="Pillar DAO - Empowering Decentralized Governance">
      <Header />
      <HomeHero />
      <HomeDao />
      <HomeProducts />
      <HomeGovernance />
      <HomeAbout />
      <Footer />
    </Layout>
  );
};

export default Index;
