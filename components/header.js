import React, { useEffect, useState } from "react";
import pillarLogo from "../assets/images/logo-pillar.png";

const Header = () => {
  return (
    <>
      <header className="header" id="header">
        <div className="container">
          
          <a href="https://www.pillar.fi" className="header__logo">
            <img src={pillarLogo} />
          </a>
          
          <nav className="header__menu">
              
              <ul id="menu">
                  <li>
                      <a href="https://www.pillar.fi/#multichain">Multichain wallet</a>
                  </li>
                  <li>
                      <a href="https://www.pillar.fi/dao/">DAO</a>
                  </li>
                  <li>
                      <a href="https://www.pillar.fi/#plr-token">PLR Token</a>
                  </li>
                  <li>
                      <a href="https://www.pillar.fi/genesis/">NFTs</a>
                  </li>
                  <li>
                      <a href="https://www.pillar.fi/about/">About us</a>
                  </li>
                  <li>
                      <a href="https://www.pillar.fi/blog/">Blog</a>
                  </li>
              </ul>
              
              <a href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer" className="header__discord">Join Discord</a>              
          </nav>

          <div className="header__mobile_menu">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
        	</div>

        </div>
      </header>
    </>
  );
};

export default Header;
