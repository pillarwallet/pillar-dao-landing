/**
 * Contract Configuration
 *
 * Automatically switches between Mainnet and Polygon Amoy Testnet
 * based on VITE_USE_TESTNET environment variable
 *
 * Default: Mainnet (when VITE_USE_TESTNET is empty or "false")
 * Testnet: Set VITE_USE_TESTNET="true"
 */

// Check if we're in testnet mode
const isTestnet = import.meta.env.VITE_USE_TESTNET === 'true'

// Mainnet Configuration (Polygon)
const MAINNET_CONFIG = {
  chainId: 137,
  chainIdHex: '0x89',
  daoContract: '0xc380f15Db7be87441d0723F19fBb440AEaa734aB',
  tokenContract: '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774',
  stakeAmount: '10000',
  explorer: 'https://polygonscan.com/tx/',
  networkName: 'Polygon Mainnet',
}

// Polygon Amoy Testnet Configuration
const TESTNET_CONFIG = {
  chainId: 80002,
  chainIdHex: '0x13882',
  daoContract: '0xf1a8685519D456f47a9F3505035F4Bad5d9a9ce0',
  tokenContract: '0x3cb29AAC77693A0784380Fb664Ec443Ce1079882',
  stakeAmount: '10', // 10 tokens for testing
  explorer: 'https://www.oklink.com/amoy/tx/',
  networkName: 'Polygon Amoy Testnet',
  // Testnet-specific settings
  minStakeTime: 6, // 6 seconds (0.1 min) for testing
  nftContract: '0x0901f5aBd34A9080Dded6dad72188aAbee8a976F',
}

// Select config based on environment
const activeConfig = isTestnet ? TESTNET_CONFIG : MAINNET_CONFIG

// Allow environment variable overrides (manual configuration takes precedence)
export const contractConfig = {
  // Chain ID
  chainId: import.meta.env.VITE_POLYGON_CHAIN_ID
    ? Number(import.meta.env.VITE_POLYGON_CHAIN_ID)
    : activeConfig.chainId,

  // Chain ID in hex format
  chainIdHex: activeConfig.chainIdHex,

  // DAO Contract Address
  daoContract: import.meta.env.VITE_DAO_CONTRACT || activeConfig.daoContract,

  // Token Contract Address
  tokenContract: import.meta.env.VITE_TOKEN || activeConfig.tokenContract,

  // Stake Amount
  stakeAmount: import.meta.env.VITE_STAKE_AMOUNT || activeConfig.stakeAmount,

  // Block Explorer
  explorer: import.meta.env.VITE_CHAIN_EXPLORER || activeConfig.explorer,

  // Network Name
  networkName: activeConfig.networkName,

  // Testnet-specific properties
  ...(isTestnet && {
    minStakeTime: activeConfig.minStakeTime,
    nftContract: activeConfig.nftContract,
  }),

  // Helper flag
  isTestnet,
}

// Export individual values for backward compatibility
export const polygonChainId = contractConfig.chainId
export const daoContractAddress = contractConfig.daoContract
export const tokenAddress = contractConfig.tokenContract
export const stakeToken = contractConfig.stakeAmount
export const explorer = contractConfig.explorer

// Export default
export default contractConfig
