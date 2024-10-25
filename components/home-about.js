import socialDiscord from "../assets/images/social-discord.png";
import { daoLinks } from "config/dao-links";

const HomeAbout = () => {
  return (
    <>
      <section className="home_about" id="about">
        <div className="container">
          <div className="home_about__detail">
            <h2>About <span>PillarDAO</span></h2>
            <div className="home_about__detail__text">
              <p>
                Incorporated in 2022 in Zug, Switzerland, PillarDAO is a legal entity known as a DAA (decentralized autonomous association). This community-led association empowers its members to shape the future of the Pillar Project and make key decisions for the project roadmap using the Association’s own funds. Following the establishment of the DAA, Pillar Project Foundation's subsidiary, Pillar Project AG, was able to legally donate 100 Million PLR tokens to the DAA treasury for utilization by the members. PillarDAO operates under Swiss law, providing a unique benefit to its members. Unlike general partnerships which bear unlimited liability for individuals, the structure of the DAA limits the legal liability of its members, offering an additional layer of protection. The Association is open to cooperation with or joining other organizations that share the same or similar interests. It also provides services for the benefit of its members, member organizations, and third parties, effectively promoting the interests of the members. Anything that directly or indirectly supports the members' interests aligns with the Association's purpose.
              </p>
              <p>PillarDAO operates under Swiss law, providing a unique benefit to its members. Unlike general partnerships which bear unlimited liability for individuals, the structure of the DAA limits the legal liability of its members, offering an additional layer of protection.</p>
              <p>The Association is open to cooperation with or joining other organizations that share the same or similar interests. It also provides services for the benefit of its members, member organizations, and third parties, effectively promoting the interests of the members. Anything that directly or indirectly supports the members' interests aligns with the Association's purpose.</p>
              <div className="home__about__buttons">
                <a
                  href={daoLinks.DAO_SOCIAL_DISCORD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__about__detail__text__discord__buttons"
                >
                  <img src={socialDiscord} alt="Discord" />
                  Join PillarDAO Discord
                </a>

                <a
                  href={daoLinks.DAO_SOCIAL_GUILDXYZ}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__about__detail__text__forum__buttons"
                >
                  NFT sign-in at Guild.xyz
                </a>
              </div>            
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeAbout;
