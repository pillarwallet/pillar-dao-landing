import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { daoLinks } from 'config/dao-links';
import pillarDaoLogo from '../assets/images/pillar-dao-logo.png';

const links = [
  { key: 1, href: '/staking#home', label: 'PLR Staking', scroll: false },
  { key: 2, href: '/#governor', label: 'Join PillarDAO', scroll: false },
  { key: 3, href: daoLinks.DAO_BLOG, label: 'Blog', scroll: false, target: '_blank' },
  { key: 4, href: '/#governance', label: 'Governance', scroll: false },
  { key: 5, href: '/#about', label: 'About', scroll: false },
];

const Header = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="header" id="header">
        <div className="container">
          <Link href="/#home" scroll={false} className="header__logo">
            <Image src={pillarDaoLogo} alt="Pillar DAO Logo" width={189} height={50} />
          </Link>

          <nav className={showMobileMenu ? 'header__menu header__menu--show' : 'header__menu'}>
            <ul id="menu" onClick={() => setShowMobileMenu(false)}>
              {links.map((link) => (
                <li key={link.key} className={router.pathname === link.href ? 'active' : ''}>
                  {link.target ? (
                    <a href={link.href} target={link.target} rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} scroll={link.scroll}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <a
              href={daoLinks.DAO_SOCIAL_DISCORD}
              target="_blank"
              rel="noopener noreferrer"
              className="header__discord"
              onClick={() => setShowMobileMenu(false)}
            >
              Join Discord
            </a>
          </nav>

          <div
            className={showMobileMenu ? 'header__mobile_menu header__mobile_menu--change' : 'header__mobile_menu'}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
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
