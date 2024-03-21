import { utils as EtherUtils } from 'ethers';
import { Sdk as EtherspotSdk, EnvNames as EtherspotEnvNames } from 'etherspot';
import { CHAIN_ID_TO_NETWORK_NAME } from 'etherspot/dist/sdk/network/constants';

import { sessionStorageInstance } from './storage';
import plrStakingAbi from '../data/abis/plrStaking.json';

const sessionStorage = sessionStorageInstance;

export class EtherspotService {
  sdk;
  instances = {};

  async init(privateKey) {
    const mainnetIds = Object.values(MAINNET_CHAIN_ID);
    const env = EtherspotEnvNames.MainNets;

    await Promise.all(
      mainnetIds.map(async (chainId) => {
        const networkName = CHAIN_ID_TO_NETWORK_NAME[chainId];

        this.instances[networkName] = new EtherspotSdk(privateKey, {
          env,
          networkName,
          sessionStorage,
          projectKey: undefined,
        });

        try {
          await this.instances[networkName].createSession();
          await this.instances[networkName].computeContractAccount({ sync: true });
        } catch (e) {
          console.log('EtherspotService', 'init failed', { chainId });
        }
      })
    );
  }

  getSdkForChain(sdkChainId) {
    const network = CHAIN_ID_TO_NETWORK_NAME[sdkChainId];

    const sdk = this.instances[network];
    if (!sdk) {
      console.log('CALLLL EtherspotService', 'getSdkForChain failed: cannot get SDK instance', {
        chainId: sdkChainId,
        network,
      });
      return null;
    }

    return sdk;
  }

  getContract(chainId, abi, address) {
    const sdk = this.getSdkForChain(chainId);

    if (!sdk) return null;

    const networkName = CHAIN_ID_TO_NETWORK_NAME[chainId];

    try {
      return sdk.registerContract(`${networkName}-${address}`, abi, address);
    } catch (error) {
      console.log('EtherspotService getContract failed', { chain: networkName, error });
      return null;
    }
  }

  async getPLRStakingData(contractAddress) {
    const stakingContract = this.getContract(137, plrStakingAbi, contractAddress);

    if (!stakingContract) return null;

    try {
      const totalStaked = await stakingContract.callTotalStaked();
      const maxStakeTotal = await stakingContract.callMaxTotalStake();
      const stakedAccounts = await stakingContract.callGetStakedAccounts();

      const totalValuedPLR = Number(EtherUtils.formatEther(totalStaked))?.toFixed(0);
      const maxStake = Number(EtherUtils.formatEther(maxStakeTotal))?.toFixed(0);
      const percentage = ((totalValuedPLR * 100) / maxStake)?.toFixed(2);
      const stakers = stakedAccounts?.length || 0;

      return { totalValuedPLR, percentage, stakers };
    } catch (error) {
      console.log('EtherspotService getPLRStakingData failed', { contractAddress, error });
      return null;
    }
  }
}

const etherspot = new EtherspotService();
export default etherspot;

export const MAINNET_CHAIN_ID = {
  ETHEREUM_MAINNET: 1,
  POLYGON: 137,
  BINANCE: 56,
  XDAI: 100,
  AVALANCHE: 43114,
  OPTIMISM: 10,
  ARBITRUM: 42161,
  FANTOM: 250,
  MOONBEAM: 1284,
  OKTC: 66,
};
