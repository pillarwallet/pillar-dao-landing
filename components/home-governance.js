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
              <p>Governors of PillarDAO have the power to vote on, and submit proposals regarding the products and control of the DAO treasury. Collectively the DAO governors run the DAO and all of its mechanisms.</p>
            </div>
            <div className="home_governance__intro__image">
              <img src={governanceBg} alt="" />
            </div>
          </div>
          
          <div className="home_governance__app" id="governor">
            <h2>How to become a <span>Governor</span></h2>
            <div className="home_governance__app__detail_wrapper">
              <div className="home_governance__app__detail">
                <p className="home_governance__app__detail_paragraph">In order to take part in the governance of PillarDAO, Members are required to lock-in 10,000 PLR tokens into the Polygon smart contract on the membership dApp below.</p>
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
                <p className="home_governance__app__detail_paragraph">Once locked each member will receive a membership NFT signalling their governor status and&nbsp;used for verification. Your membership address will be stored, you may be asked to provide name and address in the future to retain membership.</p>
                <img className="dao_member_img" src={governanceNFT} alt="" />
                <ul>
                  <li>The lock-in period is for 52 weeks after which a member can optionally burn their membership NFT and unlock their PLR tokens, deactivating governor status.</li>
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
