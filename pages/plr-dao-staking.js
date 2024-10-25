import Layout from "@components/layout";
import Header from "@components/header";
import StakingHero from "@components/staking-hero";
import StakingAbout from "@components/staking-about";
import StakingValidator from "@components/staking-validator";
import StakingDao from "@components/staking-dao";
import Footer from "@components/footer";
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
