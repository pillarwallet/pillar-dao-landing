import { ethers } from 'ethers';

// constants
import { toast } from 'react-toastify';
import {
  isMainnet,
  chainIdToNetworkName,
  chainIdToInfuraPrefix,
  chainIdToPlrAddress
} from '../utils/common';


const membershipNftContractAbi = require('../assets/abi/MembershipNFT.json');
const pillarDaoContractAbi = require('../assets/abi/PillarDAO.json')
const plrContractAbi = require('../assets/abi/plrAbi.json');

export const getDefaultProvider = (chainId = +process.env.NEXT_PUBLIC_NETWORK_ID) => new ethers.providers.FallbackProvider([
  new ethers.providers.StaticJsonRpcProvider(
    `https://${chainIdToInfuraPrefix[chainId]}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    chainIdToNetworkName[chainId],
  )
]);

export const getContract = (address, abi, provider = null) => new ethers.Contract(
  address,
  abi,
  provider || getDefaultProvider(),
);

export const getMembershipContract = (provider = null) => getContract(
  process.env.NEXT_PUBLIC_PILLAR_MEMBERSHIP_CONTRACT_ADDRESS,
  membershipNftContractAbi,
  provider,
);

export const getPlrDAOContract = (provider = null) => getContract(
  process.env.NEXT_PUBLIC_PILLAR_DAO_CONTRACT_ADDRESS,
  pillarDaoContractAbi,
  provider,
);

export const getPlrContract = (provider = null, chainId = +process.env.NEXT_PUBLIC_NETWORK_ID) => getContract(
  chainIdToPlrAddress[chainId],
  plrContractAbi,
  provider,
);

export const approveTokensForStaking = async (amount, provider) => {
  let result;

  try {
    const signer = provider.getSigner();
    const contract = getPlrContract(signer);
    result = await contract.approve(process.env.NEXT_PUBLIC_PILLAR_DAO_CONTRACT_ADDRESS, ethers.utils.parseUnits(amount.toString(), 18));
  } catch (e) {
    if (e?.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT && e?.error?.message?.startsWith('execution reverted:')) {
      toast.error(`${e.error.message.replace('execution reverted:', '')}.`);
      return;
    }
  }

  if (!result?.hash) {
    toast.error('Approve failed!');
    return;
  }

  toast.success('Approve transaction sent!', { closeOnClick: false, onClick: () => window.open(getExplorerTransactionLink(result.hash),'_newtab') });

  return result.hash;
}

export const stakePlr = async (amount, provider) => {
  let result;

  try {
    const signer = provider.getSigner();
    const contract = getPlrDAOContract(signer);
    result = await contract.deposit(ethers.utils.parseUnits(amount.toString(), 18));
  } catch (e) {
    if (e?.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT && e?.error?.message?.startsWith('execution reverted:')) {
      toast.error(`${e.error.message.replace('execution reverted:', '')}.`);
      return;
    }
  }

  if (!result?.hash) {
    toast.error('Staking failed!');
    return;
  }

  toast.success('Staking transaction sent!', { closeOnClick: false, onClick: () => window.open(getExplorerTransactionLink(result.hash),'_newtab') });

  return result.hash;
}

export const unstakePlr = async (provider) => {
  let result;

  try {
    const signer = provider.getSigner();
    const contract = getPlrDAOContract(signer);
    result = await contract.withdraw();
  } catch (e) {
    if (e?.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT && e?.error?.message?.startsWith('execution reverted:')) {
      toast.error(`${e.error.message.replace('execution reverted:', '')}.`);
      return;
    }
  }

  if (!result?.hash) {
    toast.error('Unstaking failed!');
    return;
  }

  toast.success('Unstaking transaction sent!', { closeOnClick: false, onClick: () => window.open(getExplorerTransactionLink(result.hash),'_newtab') });

  return result.hash;
}

export const getPlrBalanceForAddress = async (address, provider, chainId = +process.env.NEXT_PUBLIC_NETWORK_ID) => {
  let balance = 0;

  try {
    const contract = getPlrContract(provider, chainId);
    const balanceBN = await contract.balanceOf(address);
    balance = +ethers.utils.formatUnits(balanceBN, 18);
  } catch (e) {
    //
  }

  return balance;
}

export const isPlrStakedByAddress = async (address, provider) => {
  try {
    const contract = getPlrDAOContract(provider);
    const balanceBN = await contract.balanceOf(address);
    return balanceBN.gt(0);
  } catch (e) {
    //
  }

  return false;
}

export const canAddressUnstake = async (address, provider) => {
  try {
    const contract = getPlrDAOContract(provider);
    return contract.canUnstake(address);
  } catch (e) {
    //
  }

  return false;
}

export const checkIfApprovedForStaking = async (amount, connectedAddress, provider) => {
  try {
    const contract = getPlrContract(provider);
    const approvedAmountBN = await contract.allowance(connectedAddress, process.env.NEXT_PUBLIC_PILLAR_DAO_CONTRACT_ADDRESS);
    return approvedAmountBN.gte(ethers.utils.parseUnits(amount.toString(), 18));
  } catch (e) {
    //
  }

  return false;
}

export const getRequiredStakeAmount = async (provider) => {
  try {
    const contract = getPlrDAOContract(provider);
    const stakeAmountBN = await contract.stakingAmount();
    return +ethers.utils.formatUnits(stakeAmountBN, 18);
  } catch (e) {
    //
  }

  return 0;
}

export const getMembershipId = async (provider, address) => {
  try {
  // const signer = provider.getSigner();
  const contract = getPlrDAOContract(provider);
  const membershipId = await contract.membershipId(address);
  return membershipId;
  } catch(err) {
    console.log(err);
    return null;
  }
}

export const waitForTransaction = async (hash) => {
  try {
    return getDefaultProvider().waitForTransaction(hash);
  } catch (e) {
    //
  }

  return null;
}

export const getTokenUri = async (provider, address) => {
  const plrContract = getPlrDAOContract(provider);
  const membershipId = await plrContract.membershipId(address);
  const membershipIdContract = getMembershipContract(provider);
  const tokenURI = await membershipIdContract.tokenURI(membershipId);
  return { tokenURI, membershipId: membershipId.toString() };
}

export const getOpenSeaApiHost = () => `https://${isMainnet ? '' : 'testnets-'}api.opensea.io`;

export const getOpenSeaCollectionUrl = () => `https://${isMainnet ? '' : 'testnets.'}opensea.io/collection/${process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_SLUG}`;

export const getExplorerLink = () => isMainnet ? `https://polygonscan.com` : `https://rinkeby.etherscan.io`;

export const getExplorerContractLink = () => `${getExplorerLink()}/address/${process.env.NEXT_PUBLIC_PILLAR_MEMBERSHIP_CONTRACT_ADDRESS}`;

export const getExplorerTransactionLink = (hash) => `${getExplorerLink()}/tx/${hash}`;
