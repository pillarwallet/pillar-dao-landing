import React, { useState, useEffect } from "react";
import Head from "next/head";

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
      </Head>
      <div className="page-wrapper" id="wrapper">
        {children}
      </div>
    </div>
  );
};

export default Layout;
