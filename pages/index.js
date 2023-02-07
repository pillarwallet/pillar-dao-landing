import React from "react";
import Layout from "@components/layout";
import Header from "@components/header";
import Hero from "@components/hero";
import About from "@components/about";
import Application from "@components/application";
import Dao from "@components/dao";
import Footer from "@components/footer";
const Index = () => {
  return (
    <Layout pageTitle="PillarDAO">
      <Header />
      <Hero />
      <About />
      <Application />
      <Dao />
      <Footer />
    </Layout>
  );
};

export default Index;
