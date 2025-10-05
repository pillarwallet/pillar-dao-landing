# Testnet Mode Configuration

This project supports automatic switching between **Polygon Mainnet** and **Polygon Amoy Testnet** using a single environment variable.

## Quick Start

### Using Mainnet (Default)

Leave `VITE_USE_TESTNET` empty or set to `false` in your `.env` file:

```bash
VITE_USE_TESTNET=""
# or
VITE_USE_TESTNET="false"
```

### Using Polygon Amoy Testnet

Set `VITE_USE_TESTNET` to `true` in your `.env` file:

```bash
VITE_USE_TESTNET="true"
```

That's it! The application will automatically use the correct contract addresses and chain configuration.

## Network Configurations

### Mainnet (Polygon)

When `VITE_USE_TESTNET` is `false` or empty:

- **Chain ID**: 137 (0x89)
- **Network**: Polygon Mainnet
- **PLR Token**: `0xa6b37fC85d870711C56FbcB8afe2f8dB049AE774`
- **DAO Contract**: `0xc380f15Db7be87441d0723F19fBb440AEaa734aB`
- **Stake Amount**: 10,000 PLR
- **Explorer**: https://polygonscan.com/tx/

### Testnet (Polygon Amoy)

When `VITE_USE_TESTNET` is `true`:

- **Chain ID**: 80002 (0x13882)
- **Network**: Polygon Amoy Testnet
- **Test DAO Contract**: `0xf1a8685519D456f47a9F3505035F4Bad5d9a9ce0`
- **Test Token** (with airdrop function): `0x3cb29AAC77693A0784380Fb664Ec443Ce1079882`
- **Stake Amount**: 10 tokens (for testing)
- **Min Stake Time**: 0.1 min (6 seconds)
- **Test NFT Contract**: `0x0901f5aBd34A9080Dded6dad72188aAbee8a976F`
- **Explorer**: https://www.oklink.com/amoy/tx/

## Manual Override

You can still manually override individual contract addresses if needed. Manual overrides take precedence over the automatic configuration:

```bash
VITE_USE_TESTNET="true"
VITE_DAO_CONTRACT="0xYourCustomAddress"  # This will override the testnet default
```

## How It Works

The configuration is managed by `config/contracts.js`, which:

1. Checks the `VITE_USE_TESTNET` environment variable
2. Loads the appropriate network configuration (mainnet or testnet)
3. Allows manual overrides via individual environment variables
4. Exports the final configuration for use throughout the application

## Components Using Auto-Configuration

The following components automatically use the correct network configuration:

- `components/dao/nft-transaction.js` - NFT membership transactions
- `components/dao/unstake-gov-nft-flow.js` - Unstaking flow
- `components/staking-hero.js` - Staking hero section

## Development Workflow

### Testing on Polygon Amoy

1. Create/update `.env`:
   ```bash
   VITE_USE_TESTNET="true"
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. The app will now use Polygon Amoy testnet contracts

4. Get test tokens from the airdrop function:
   - Contract: `0x3cb29AAC77693A0784380Fb664Ec443Ce1079882`
   - Use the airdrop function to get test PLR tokens

### Deploying to Production

1. Ensure `.env` has testnet mode disabled:
   ```bash
   VITE_USE_TESTNET="false"
   ```

2. Or simply leave it empty (default is mainnet)

## Troubleshooting

### Wrong network detected

Make sure to restart your development server after changing `VITE_USE_TESTNET`:

```bash
# Stop the server (Ctrl+C)
npm run dev  # Start again
```

### Still using old addresses

Check if you have manual overrides in your `.env` file. Manual overrides take precedence over automatic configuration.

### Tests failing after changes

Tests use mainnet configuration by default. If you need to test with testnet config, update `jest.setup.js`:

```javascript
process.env.VITE_USE_TESTNET = 'true'
```

## Configuration Reference

See `config/contracts.js` for the complete configuration structure and available options.

## Environment Variables

### Core Settings
- `VITE_USE_TESTNET` - Set to "true" for testnet, "false" or empty for mainnet

### Optional Overrides (auto-configured if empty)
- `VITE_POLYGON_CHAIN_ID` - Chain ID (137 for mainnet, 80002 for testnet)
- `VITE_DAO_CONTRACT` - DAO contract address
- `VITE_TOKEN` - PLR token contract address
- `VITE_STAKE_AMOUNT` - Required stake amount
- `VITE_CHAIN_EXPLORER` - Block explorer base URL

### Other Required Settings
- `VITE_WALLET_CONNECT_PROJECT_ID` - WalletConnect project ID for ConnectKit
- `VITE_INFURA_ID` - Infura project ID for RPC endpoints
- `NOTION_DATABASE` - Notion database ID
- `NOTION_SECRET_KEY` - Notion API secret key
