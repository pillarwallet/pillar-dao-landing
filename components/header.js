import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import pillarDaoLogo from "../assets/images/pillar-dao-logo.png";

const links = [
  { href: "/staking#home", label: "PLR Staking", scroll: false},
  { href: "/#governor", label: "Join PillarDAO", scroll: false},
  { href: "/#products", label: "Products", scroll: false},
  { href: "/#governance", label: "Governance", scroll: false},
  { href: "/#about", label: "About", scroll: false},
]

const Header = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="header" id="header">
        <div className="container">
          
          <Link href="/#home" className="header__logo" scroll={false}>
            <img src={pillarDaoLogo} />
          </Link>
          
          <nav className= {showMobileMenu ? "header__menu header__menu--show" : "header__menu"}>
            <ul id="menu" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            
              {links.map((link) => (
                <li className={router.pathname == link.href ? "active" : ""}>
                  <Link href={link.href} target={link.target} scroll={link.scroll}>{link.label}</Link>
                </li>
              ))}
                
            </ul>
            
            <Link href="https://chat.pillar.fi/" target="_blank" rel="noopener noreferrer" className="header__discord" onClick={() => setShowMobileMenu(!showMobileMenu)}>Join Discord</Link>
          </nav>

          <div className= {showMobileMenu ? "header__mobile_menu header__mobile_menu--change" : "header__mobile_menu"} onClick={() => setShowMobileMenu(!showMobileMenu)}>
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