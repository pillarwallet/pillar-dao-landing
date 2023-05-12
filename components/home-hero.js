import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HomeHero = () => {

  return (
    <>
      <section className="home_hero" id="home">
        <div className="container">
          <div className="home_hero__headline">
            <h1>PillarDAO</h1>
            <p>A decentralized autonomous association (DAA) aka DAO that builds & funds Web3 infrastructure</p>
            <Link href="/#governor" scroll={false}>Get a Membership NFT</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeHero;
