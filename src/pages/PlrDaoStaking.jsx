//not used
import Layout from "@components/shared/layout";
import Header from "@components/shared/header";
import StakingHero from "@components/staking-hero";
import StakingAbout from "@components/staking/about-section";
import StakingValidator from "@components/staking-validator";
import StakingDao from "@components/staking-dao";
import Footer from "@components/shared/footer";
const Index = () => {
  return (
    <Layout pageTitle="Pillar DAO - PLR Staking ">
      <Header />
      <StakingHero />
      <StakingAbout />
      <StakingValidator />
      <StakingDao />
      <Footer />
    </Layout>
  );
};

export default Index;
