import Link from "next/link";
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
              <p>As a member, you're not just a passive participant but an active Governor with a voice and vote. You'll have the power to submit and vote on proposals impacting the Pillar ecosystem, including the products we build and the management of the DAO treasury. As Governors, we steer the direction of PillarDAO together, running all of its mechanisms and making decisions that shape our decentralized future.</p>
            </div>
            <div className="home_governance__intro__image">
              <img src={governanceBg} alt="" />
            </div>
          </div>
          
          <div className="home_governance__app" id="governor">
            <h2>How to become a <span>Governor</span></h2>
            <div className="home_governance__app__detail_wrapper">
              <div className="home_governance__app__detail">
                <p className="home_governance__app__detail_paragraph">To join PillarDAO you are required to lock in 10,000 PLR tokens within the Polygon smart contract on the membership dApp provided below.</p>
                <div className='plr_dao_block' >
                  <WagmiProvider>
                    <PlrDaoStakingBuilder />
                  </WagmiProvider>
                </div>
              </div>
              <div className="home_governance__app__detail">
                <p className="home_governance__app__detail_paragraph">Once locked, you will receive a membership NFT confirming your governor status, which will be utilized for verification purposes.</p>
                <img className="dao_member_img" src={governanceNFT} alt="" />
                <ul>
                  <li>The lock-in period is for 52 weeks after which you can optionally burn your membership NFT and unlock your PLR tokens, deactivating governor status.</li>
                  <li>PillarDAO proposals are discussed in the Pillar Governance <Link href="https://gov.pillar.fi/" target="_blank" rel="noopener noreferrer">Forum</Link> and once consensus is reached, voted on using <Link href="https://snapshot.org/#/pillar" target="_blank" rel="noopener noreferrer">SnapShot</Link>. The process for submitting a proposal is pinned on the forum.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeGovernance;
