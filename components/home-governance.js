import Link from "next/link";
import { daoLinks } from "config/dao-links";
import governanceBg from "../assets/images/home-governance-bg.png";
import governanceNFT from "../assets/images/home-governance-nft.png";
import PlrDaoStakingBuilder from "./plr-dao-buidler";
import WagmiProvider from "../components/WagmiProvider";

const HomeGovernance = () => {
  return (
    <>
      <section className="home_governance" id="governance">
        <div className="container">
          <div className="home_governance__intro">
            <div className="home_governance__intro__text">
              <h2><span>Governance</span></h2>
              <p>As a member, you're not just a passive participant but an active  decision maker with a voice and vote. You'll have the power to submit and vote on proposals impacting the Pillar ecosystem, including the products we build and the management of the DAO treasury. As  members, we steer the direction of PillarDAO together, running all of its mechanisms and making decisions that shape our decentralized future.</p>
            </div>
            <div className="home_governance__intro__image">
              <img src={governanceBg} alt="" />
            </div>
          </div>
          
          <div className="home_governance__app" id="governor">
            <h2>How to become a <span>Member</span></h2>
            <div className="home_governance__app__detail_wrapper">
              <div className="home_governance__app__detail">
                <p className="home_governance__app__detail_paragraph">To join PillarDAO you are required to lock in 10,000 PLR tokens within the Polygon smart contract on the membership dApp provided below.</p>
                <p className="home_governance__app__detail_paragraph">
                  By proceeding to stake PLR tokens for a PillarDAO member NFT, you consent to Article 11* providing your name, address, and email.
                  This information is gathered to protect the integrity of the DAO Voting process and to assure the compliance of our Swiss Association.
                </p>
                <div className='plr_dao_block' >
                  <WagmiProvider>
                    <PlrDaoStakingBuilder
                      defaultTransactionBlock={"PLR_DAO_STAKE"}
                      shouldDisplayForm={true}
                    />
                  </WagmiProvider>
                </div>
              </div>
              <div className="home_governance__app__detail">
                <p className="home_governance__app__detail_paragraph">Once locked, you will receive a membership NFT confirming your status, which will be utilized for verification purposes.</p>
                <img className="dao_member_img" src={governanceNFT} alt="" />
                <ul>
                  <li>The lock-in period is for 52 weeks after which you can optionally burn your membership NFT and unlock your PLR tokens, deactivating membership status.</li>
                  <li>PillarDAO proposals are discussed in the <Link href={daoLinks.DAO_SOCIAL_GUILDXYZ} target="_blank" rel="noopener noreferrer">Members Only Discord Guild</Link> and once consensus is reached, voted on using <Link href="https://snapshot.org/#/pillar" target="_blank" rel="noopener noreferrer">SnapShot</Link>. The process for submitting a proposal is pinned on the <Link href={daoLinks.DAO_SOCIAL_DISCORD} target="_blank" rel="noopener noreferrer">Discord channel</Link>.</li>
                </ul>
              </div>
            </div>
          </div>
          <p style={{ marginTop: '20px' }}>
            *Article 11: Becoming a Member. Everyone who is eligible for a membership in accordance with Article 10 can make a request (request-Membership). Moreover, an applicant must provide his name, address, and email. The admission procedure is automated and shown in Annex 2a to these Articles of Association. The minimum duration of membership is fifty-two (52) weeks. Thereafter, membership shall be automatically renewed until terminated in accordance with Section IV (of the DAO Articles of Association).
          </p>
        </div>
      </section>
    </>
  );
};

export default HomeGovernance;
