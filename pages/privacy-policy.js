import React from "react";
import Layout from "@components/layout";
import Header from "@components/header";
import PrivacyPolicy from "@components/privacy-policy";
import Footer from "@components/footer";

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