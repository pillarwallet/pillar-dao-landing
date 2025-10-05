# Testing Documentation

This project uses Jest and React Testing Library for testing.

## Setup

Install dependencies:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

```
__tests__/
├── components/
│   ├── auth/
│   │   └── wallet-connect.test.js
│   ├── dao/
│   │   ├── governance-nft-flow.test.js
│   │   ├── member-form.test.js
│   │   └── nft-transaction.test.js
│   └── staking/
│       └── staking-flow.test.js
```

## Test Coverage

The test suite covers the following components and functionality:

### 1. Wallet Connect (`auth/wallet-connect.test.js`)
- Wallet connection options (MetaMask, WalletConnect, ConnectKit, Injected)
- Provider handling
- Loading states
- Multiple wallet support

### 2. Governance NFT Flow (`dao/governance-nft-flow.test.js`)
- Wagmi authentication flow
- ConnectKit integration
- Form display logic
- Notion data fetching
- Logout functionality
- LocalStorage constants

### 3. Member Form (`dao/member-form.test.js`)
- Form rendering
- Default value population
- Email validation
- Wallet address validation
- Form submission
- Error handling
- Logout functionality
- Field updates

### 4. NFT Transaction (`dao/nft-transaction.test.js`)
- Chain detection (Polygon)
- Membership status checking
- Unstake button visibility logic
- Transaction flow (approve/deposit)
- Contract read operations
- Loading states
- Error handling

### 5. Staking Flow (`staking/staking-flow.test.js`)
- Wagmi provider connection
- Etherspot panel display
- Provider state management
- Transaction block props
- Logout functionality
- Provider cleanup

## Mocked Dependencies

The following dependencies are mocked in `jest.setup.js`:

- `wagmi` hooks (useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useSwitchChain)
- `connectkit` components and hooks
- `next/router`
- `next/dynamic`
- `window.matchMedia`

## Environment Variables

Test environment variables are set in `jest.setup.js`:

```javascript
VITE_WALLET_CONNECT_PROJECT_ID
VITE_INFURA_ID
VITE_USE_TESTNET
VITE_POLYGON_CHAIN_ID
VITE_DAO_CONTRACT
VITE_TOKEN
VITE_STAKE_AMOUNT
VITE_CHAIN_EXPLORER
```

## Writing New Tests

When writing new tests, follow these guidelines:

1. **Test file naming**: `ComponentName.test.js`
2. **Test organization**: Group tests using `describe` blocks
3. **Mock setup**: Set up mocks in `beforeEach` and clean up in `afterEach`
4. **User interactions**: Use `@testing-library/user-event` for simulating user actions
5. **Async operations**: Use `waitFor` for async operations
6. **Assertions**: Use Jest matchers and Testing Library queries

### Example Test Structure

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Component from '@components/path/to/Component'

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Setup mocks
  })

  describe('Feature Group', () => {
    it('should do something specific', async () => {
      const user = userEvent.setup()
      render(<Component />)

      // Interact with component
      await user.click(screen.getByRole('button'))

      // Assert expected behavior
      await waitFor(() => {
        expect(screen.getByText('Expected Text')).toBeInTheDocument()
      })
    })
  })
})
```

## Continuous Integration

Tests should be run in CI/CD pipelines before deploying:

```bash
npm test -- --ci --coverage --maxWorkers=2
```

## Troubleshooting

### Tests failing due to missing mocks
Check `jest.setup.js` to ensure all required dependencies are mocked.

### Timeout errors
Increase timeout for async operations:
```javascript
await waitFor(() => {
  expect(something).toBe(true)
}, { timeout: 5000 })
```

### Module resolution errors
Check `jest.config.js` for correct path mappings:
```javascript
moduleNameMapper: {
  '^@components/(.*)$': '<rootDir>/components/$1',
}
```
