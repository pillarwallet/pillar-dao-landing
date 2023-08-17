import React from "react";
import Head from "next/head";
import Script from 'next/script';

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="PillarDAO builds, funds and explores web3, multichain infrastructure and technology for a decentralised future. Join us now!" />
        <meta
          name="keywords"
          content="PillarDAO, pillar, dao, web3, multichain infrastructure, decentralised" />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content="PillarDAO builds, funds and explores web3, multichain infrastructure and technology for a decentralised future. Join us now!" />
        <meta property="og:image" content="https://pillardao.org/pillar_dao.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={pageTitle} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content="PillarDAO builds, funds and explores web3, multichain infrastructure and technology for a decentralised future. Join us now!" />
        <meta name="twitter:image" content="https://pillardao.org/pillar_dao.png" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WHWT189N5K"></Script>
        <Script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window !== "undefined"){
              window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());
              gtag('config', 'G-WHWT189N5K');
            }`
          }}
        />
      </Head>
      <div className="page-wrapper" id="wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout;
