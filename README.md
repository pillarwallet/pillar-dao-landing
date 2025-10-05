This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Installation

```bash
npm ci
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required environment variables in `.env.local`

3. **Optional**: Enable testnet mode for Polygon Amoy:
   ```bash
   NEXT_PUBLIC_USE_TESTNET="true"
   ```

   See [TESTNET_MODE.md](./TESTNET_MODE.md) for detailed network configuration.

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

Run the test suite:

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Network Configuration

This project supports automatic switching between Polygon Mainnet and Polygon Amoy Testnet.

- **Mainnet** (default): Set `NEXT_PUBLIC_USE_TESTNET=""` or `"false"`
- **Testnet**: Set `NEXT_PUBLIC_USE_TESTNET="true"`

See [TESTNET_MODE.md](./TESTNET_MODE.md) for complete network configuration details.

## Project Structure

```
components/
├── auth/          # Authentication components
├── dao/           # DAO and governance components
├── staking/       # Staking components
├── home/          # Home page sections
├── swap/          # Token swap components
└── shared/        # Shared UI components

config/
└── contracts.js   # Network and contract configuration

__tests__/         # Test files
```