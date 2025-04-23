import { ethers } from 'ethers';
import PlrDaoStakingBuilderUnstake from './plr-dao-buidler-unstake';

const polygonChainId = Number(process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID || 137);
const daoContractAddress = process.env.NEXT_PUBLIC_DAO_CONTRACT || '0xc380f15Db7be87441d0723F19fBb440AEaa734aB';
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN || '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774';
const stakeToken = process.env.NEXT_PUBLIC_STAKE_AMOUNT || '10000';
const stakeTokenAmount = ethers.utils.parseUnits(stakeToken, 18);
const explorer = process.env.NEXT_PUBLIC_CHAIN_EXPLORER || `https://polygonscan.com/tx/`;

const StakingHero = () => {

  return (
    <>
      <section className="staking_hero" id="home">
        <div className="container">
          <div className="staking_hero__headline">
            <h1>Unstake your PLR tokens</h1>
          </div>
          <div className="staking_hero__dapp">
            <PlrDaoStakingBuilderUnstake />
            {/* <DaoMemberNftTx /> */}
            <p>Supported browsers: Chrome, Firefox <br />Supported wallet: MetaMask</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default StakingHero;
