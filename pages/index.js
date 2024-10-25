import Layout from "@components/layout";
import Header from "@components/header";
import HomeHero from "@components/home-hero";
import HomeDao from "@components/home-dao";
import HomeProducts from "@components/home-products";
import HomeGovernance from "@components/home-governance";
import HomeAbout from "@components/home-about";
import Footer from "@components/footer";
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
