require('@testing-library/jest-dom')

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const defaultAccountState = {
  address: null,
  connector: null,
  isConnected: false,
}

const useAccount = jest.fn(() => ({ ...defaultAccountState }))
const useConnect = jest.fn(() => ({ connect: jest.fn(), connectors: [] }))
const useDisconnect = jest.fn(() => ({ disconnect: jest.fn() }))
const useReadContract = jest.fn(() => ({ data: undefined, isLoading: false }))
const useWriteContract = jest.fn(() => ({ writeContract: jest.fn(), isLoading: false }))
const useSwitchChain = jest.fn(() => ({ switchChain: jest.fn() }))
const useEnsName = jest.fn(() => ({ data: null, isLoading: false }))

const useConfig = jest.fn(() => ({ connectors: [] }))
const createConfig = jest.fn(() => ({ connectors: [], publicClient: {}, webSocketPublicClient: {} }))
const http = jest.fn(() => ({}))
const WagmiProvider = ({ children }) => children

jest.mock('wagmi', () => ({
  WagmiProvider,
  createConfig,
  http,
  useConfig,
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useSwitchChain,
  useEnsName,
}))

jest.mock('wagmi/actions', () => ({
  reconnect: jest.fn(),
}))

const connectkitMock = require('./__mocks__/connectkit.js')

jest.mock('connectkit', () => connectkitMock)
process.env.VITE_WALLET_CONNECT_PROJECT_ID = 'test-wallet-connect-id'
process.env.VITE_INFURA_ID = 'test-infura-id'
process.env.VITE_USE_TESTNET = 'false'
process.env.VITE_POLYGON_CHAIN_ID = '137'
process.env.VITE_DAO_CONTRACT = '0xc380f15Db7be87441d0723F19fBb440AEaa734aB'
process.env.VITE_TOKEN = '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774'
process.env.VITE_STAKE_AMOUNT = '10000'
process.env.VITE_CHAIN_EXPLORER = 'https://polygonscan.com/tx/'
