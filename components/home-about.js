import React, { useEffect, useState } from "react";
import Link from "next/link";
const HomeAbout = () => {
  return (
    <>
      <section className="home_about" id="about">
        <div className="container">
          <div className="home_about__detail">
            <h2>About <span>PillarDAO</span></h2>
            <div className="home_about__detail__text">
              <p>In 2020 Pillar Project Foundation decided to start gradually shifting decision-making power to token holders in the PillarDAO. This confirmed the project's community-first ethos and made Pillar the platform where users vote on funding development, business or marketing initiatives. Pillar governance is open and available to all PLR holders enabling them to have a say on the project's future.</p>
              <p>In 2022, PillarDAO was officially incorporated in Zug, Switzerland as a legal entity known as a DAA (decentralized autonomous association) and now operates with the purpose of allowing its members to influence and shape the future of Pillar Project and make key decisions for the project roadmap using the Association’s own funds. By setting up a DAA, Pillar Project Foundation was able to legally donate 100 Million PLR tokens to the PillarDAO treasury for use by the members of the DAO.</p>
              <ul>
                <li>The Association can cooperate with or join other organisations that represent the same or similar interests.</li>
                <li>The Association can provide services for the benefit of its members and member organisations or third parties and do anything that directly or indirectly promotes the interests of the members.</li>
              </ul>
              <Link href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer" className="home_about__detail__text__discord">Join Pillar DAO Discord</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeAbout;
