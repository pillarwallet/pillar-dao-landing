// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// No Next.js mocks needed for Vite + React

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: undefined,
    isConnected: false,
    connector: null,
  })),
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: [],
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
  })),
  useReadContract: jest.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
  useWriteContract: jest.fn(() => ({
    writeContract: jest.fn(),
    isLoading: false,
  })),
  useSwitchChain: jest.fn(() => ({
    switchChain: jest.fn(),
  })),
}))

// Mock Privy hooks
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: jest.fn(() => ({
    ready: true,
    authenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
  })),
  useWallets: jest.fn(() => ({
    wallets: [],
  })),
}))

// Mock environment variables (Vite-style)
process.env.VITE_PRIVY_APP_ID = 'test-privy-app-id'
process.env.VITE_WALLET_CONNECT_PROJECT_ID = 'test-wallet-connect-id'
process.env.VITE_INFURA_ID = 'test-infura-id'
process.env.VITE_USE_TESTNET = 'false' // Use mainnet config for tests by default
process.env.VITE_POLYGON_CHAIN_ID = '137'
process.env.VITE_DAO_CONTRACT = '0xc380f15Db7be87441d0723F19fBb440AEaa734aB'
process.env.VITE_TOKEN = '0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774'
process.env.VITE_STAKE_AMOUNT = '10000'
process.env.VITE_CHAIN_EXPLORER = 'https://polygonscan.com/tx/'
