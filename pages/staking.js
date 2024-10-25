import Layout from "@components/layout";
import Header from "@components/header";
import StakingHero from "@components/staking-hero";
import StakingAbout from "@components/staking-about";
import StakingApplication from "@components/staking-application";
import StakingDao from "@components/staking-dao";
import Footer from "@components/footer";
const Index = () => {
  return (
    <Layout pageTitle="PillarDAO - PLR Staking ">
      <Header />
      <StakingHero />
      <StakingAbout />
      <StakingApplication />
      <StakingDao />
      <Footer />
    </Layout>
  );
};

export default Index;
