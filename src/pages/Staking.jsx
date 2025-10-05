//dao plr staking rewards campaign
import Layout from "@components/shared/layout";
import Header from "@components/shared/header";
import StakingHero from "@components/staking-hero";
import StakingAbout from "@components/staking/about-section";
import StakingApplication from "@components/staking-application";
import StakingDao from "@components/staking-dao";
import Footer from "@components/shared/footer";
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
