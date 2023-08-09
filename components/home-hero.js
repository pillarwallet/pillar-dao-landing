import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HomeHero = () => {

  return (
    <>
      <section className="home_hero" id="home">
        <div className="container">
          <div className="home_hero__headline">
            <h1>PillarDAO</h1>
            <p>You own it. You run it. You make the decentralized multichain future a reality</p>
            <Link href="/#governor" scroll={false}>Get a Membership NFT</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeHero;
