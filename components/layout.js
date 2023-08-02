import React from "react";
import Head from "next/head";

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <meta
          name="description"
          content="PillarDAO builds, funds and explores web3, multichain infrastructure and technology for a decentralised future. Join us now!"
      ></meta>
        <meta name="keywords" content="PillarDAO, pillar, dao, web3, multichain infrastructure, decentralised"></meta>
        <meta property="og:title" content={pageTitle}></meta>
        <meta
          property="og:description"
          content="PillarDAO builds, funds and explores web3, multichain infrastructure and technology for a decentralised future. Join us now!"></meta>
        <meta property="og:image" content="https://pillardao.org/favicon.ico"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:site_name" content={pageTitle}></meta>
        {/* Twitter metadata */}
        <meta name="twitter:title" content={pageTitle}></meta>
        <meta name="twitter:description" content="PillarDAO builds, funds and explores web3, multichain infrastructure and technology for a decentralised future. Join us now!"></meta>
        <meta name="twitter:image" content="https://pillardao.org/favicon.ico"></meta>
      </Head>
      <div className="page-wrapper" id="wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout;
