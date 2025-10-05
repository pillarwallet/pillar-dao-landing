# Privy Integration Setup

This document explains how to complete the Privy integration for the Pillar DAO governance NFT signup page.

## Changes Made

### 1. Package Dependencies
- Added `@privy-io/react-auth` v1.90.0 to package.json
- Removed `@web3auth/torus-evm-adapter` from package.json

### 2. App Configuration (`pages/_app.js`)
- Wrapped the app with `PrivyProvider`
- Configured Privy with dark theme and Polygon as default chain

### 3. Environment Variables (`.env.example`)
- Added `NEXT_PUBLIC_PRIVY_APP_ID` to environment variables

### 4. Sign-In Component (`components/plr-dao-buidler-sign-in.js`)
- Added Privy as a login option alongside MetaMask and WalletConnect
- Integrated `usePrivy` hook for Privy authentication
- Created a custom Privy icon component

### 5. Main Builder Component (`components/plr-dao-buidler.js`)
- Integrated Privy hooks (`usePrivy`, `useWallets`)
- Added logic to handle Privy wallet provider extraction
- Updated `onLogout` function to include Privy logout
- Updated authentication checks to include Privy state

## Setup Instructions

### 1. Install Dependencies

First, fix the node_modules issue and install the new dependencies:

```bash
# Remove the problematic node_modules directory
rm -rf node_modules package-lock.json

# Install dependencies
npm install --legacy-peer-deps
```

### 2. Get Privy App ID

1. Go to [Privy Dashboard](https://dashboard.privy.io/)
2. Create a new app or use an existing one
3. Copy your App ID

### 3. Configure Environment Variables

Add your Privy App ID to your `.env` file:

```bash
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id-here"
```

### 4. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the governance NFT signup page (home page, governance section)

3. Test the following:
   - Click "Privy" button and authenticate
   - Verify wallet address populates in the form
   - Switch to Polygon network
   - Complete the NFT signup transaction

## Features

- ✅ **MetaMask** login (existing)
- ✅ **WalletConnect** login (existing)
- ✅ **Privy** login (NEW)
- ✅ Form auto-population with wallet address
- ✅ Network switching to Polygon
- ✅ Logout functionality for all providers
- ✅ Staking/Unstaking pages unchanged (still use Etherspot)

## Notes

- Privy integration is **only** on the governance NFT signup page
- Staking and unstaking pages still use the existing Etherspot login
- Torus wallet adapter has been removed from dependencies
- All existing functionality (MetaMask, WalletConnect) remains intact

## Troubleshooting

### npm install fails
If you encounter issues with `npm install`, try:
```bash
npm install --legacy-peer-deps --force
```

### Privy not working
- Verify `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly in `.env`
- Check browser console for errors
- Ensure you're on the governance page (not staking/unstaking)

### Address not populating
- Check that the Privy wallet has been created (visible in Privy dashboard)
- Verify the useEffect hooks in `plr-dao-buidler.js` are triggering
- Check console for any provider errors
