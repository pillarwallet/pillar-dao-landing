import Layout from "@components/shared/layout";
import Header from "@components/shared/header";
import PrivacyPolicy from "@components/shared/privacy-policy";
import Footer from "@components/shared/footer";

const Index = () => {
  return (
    <Layout pageTitle="PillarDAO - Privacy Policy">
      <Header />
      <PrivacyPolicy />
      <Footer />
    </Layout>
  );
};

export default Index;