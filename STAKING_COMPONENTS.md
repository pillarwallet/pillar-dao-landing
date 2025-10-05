# Staking Components Guide

## ⚠️ CRITICAL: Two Different Staking Systems

This project has **TWO SEPARATE staking systems** with confusingly similar names. **Do NOT mix them up!**

---

## 1. Regular PLR Staking (stkPLR Pool)

**Location:** `/staking` page

**What it does:** Users stake PLR tokens to earn WETH rewards. They receive stkPLR tokens representing their stake.

**Contract:** `0x826a26e65266c5834977D4f552d31b9e29F668d4` (Polygon mainnet)

**Token:** stkPLR `0x99b4071d2509f3bfb4c1f9cbe174da1f3dc43480`

### Components Used:

| Component | File | Purpose |
|-----------|------|---------|
| `StakingHero` | `src/components/staking-hero.jsx` | Unstake section |
| `UnstakeButton` | `src/components/staking/unstake-button.jsx` | **Checks stkPLR balance** |
| `PlrStakingBuilder` | `src/components/staking/staking-flow.jsx` | Uses Etherspot for staking UI |

### How Unstaking Works:
1. Checks wallet for **stkPLR token balance** (not NFT!)
2. User approves stkPLR contract
3. Calls `unstake()` function
4. Returns original PLR + rewards

---

## 2. DAO Governance Staking (NFT Membership)

**Location:** `/plr-dao-staking` page

**What it does:** Users stake PLR to get an NFT that grants DAO voting rights.

**Contract:**
- Mainnet: `0xc380f15Db7be87441d0723F19fBb440AEaa734aB`
- Testnet: `0xf1a8685519D456f47a9F3505035F4Bad5d9a9ce0`

**Token:** PLR token (locked in contract, NFT minted)

### Components Used:

| Component | File | Purpose |
|-----------|------|---------|
| `DaoMemberNftTx` | `src/components/dao/nft-transaction.jsx` | Stake section |
| `DaoUnstakeButton` | `src/components/dao/dao-unstake-button.jsx` | **Checks NFT membership** |
| `PlrDaoStakingBuilderUnstake` | `src/components/dao/unstake-gov-nft-flow.jsx` | Unstake flow wrapper |
| `MemberInfo` | `src/components/dao/member-info.jsx` | Shows NFT details |

### How Unstaking Works:
1. Checks wallet for **NFT membership ID** (not tokens!)
2. No approval needed
3. Calls `withdraw()` function
4. Burns NFT, returns staked PLR

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG - Mixing Components

```jsx
// staking-hero.jsx (regular staking page)
import PlrDaoStakingBuilderUnstake from './dao/unstake-gov-nft-flow';  // ❌ WRONG!

// This checks for NFT membership, not stkPLR tokens!
<PlrDaoStakingBuilderUnstake />
```

### ✅ CORRECT

```jsx
// staking-hero.jsx (regular staking page)
import UnstakeButton from './staking/unstake-button';  // ✅ CORRECT

// This checks for stkPLR token balance
<UnstakeButton
  chainId={137}
  contract="0x826a26e65266c5834977D4f552d31b9e29F668d4"
  explorer="https://polygonscan.com/tx/"
  networkName="Polygon Mainnet"
/>
```

---

## 📋 Quick Reference

| Feature | Regular Staking | DAO Governance |
|---------|----------------|----------------|
| **URL** | `/staking` | `/plr-dao-staking` |
| **Checks for** | stkPLR token balance | NFT membership ID |
| **Unstake Component** | `UnstakeButton` | `DaoUnstakeButton` |
| **Contract Function** | `unstake()` | `withdraw()` |
| **Approval Needed?** | Yes (stkPLR) | No |
| **Returns** | PLR + WETH rewards | Staked PLR |
| **Token Received** | stkPLR (ERC20) | NFT (ERC721) |

---

## 🔍 How to Identify Which Component to Use

### Ask yourself:

**1. Which page am I working on?**
- `/staking` → Use `UnstakeButton`
- `/plr-dao-staking` → Use `DaoUnstakeButton`

**2. What does the user have in their wallet?**
- stkPLR tokens → Use `UnstakeButton`
- DAO membership NFT → Use `DaoUnstakeButton`

**3. What contract am I calling?**
- `0x826a26...` (staking contract) → Use `UnstakeButton`
- `0xc380f1...` or `0xf1a868...` (DAO contract) → Use `DaoUnstakeButton`

---

## 📂 File Organization

```
src/
├── components/
│   ├── staking-hero.jsx              ← Regular staking page hero (uses UnstakeButton)
│   ├── staking/
│   │   ├── unstake-button.jsx        ← FOR REGULAR STAKING (stkPLR)
│   │   └── staking-flow.jsx          ← Etherspot integration
│   └── dao/
│       ├── nft-transaction.jsx       ← DAO staking/unstaking
│       ├── dao-unstake-button.jsx    ← FOR DAO GOVERNANCE (NFT)
│       ├── unstake-gov-nft-flow.jsx  ← DAO unstake wrapper
│       └── member-info.jsx           ← NFT membership info
```

---

## 🧪 Testing Checklist

Before deploying, verify:

- [ ] `/staking` page shows `UnstakeButton` component
- [ ] `/plr-dao-staking` page shows `DaoUnstakeButton` component
- [ ] `UnstakeButton` checks for stkPLR balance (0x99b40...)
- [ ] `DaoUnstakeButton` checks for NFT membership
- [ ] No component mixing between the two systems
- [ ] Correct contract addresses for mainnet vs testnet

---

## 🆘 Troubleshooting

### "You have no tokens to unstake" on `/staking`
- ✅ This is correct if user has no stkPLR tokens
- ❌ Check you're using `UnstakeButton`, not `DaoUnstakeButton`

### "You do not have an active DAO membership" on `/staking`
- ❌ **WRONG!** You're using `DaoUnstakeButton` on the regular staking page
- ✅ Use `UnstakeButton` instead

### "You do not have an active DAO membership" on `/plr-dao-staking`
- ✅ This is correct if user has no NFT membership
- ❌ Check the contract address is correct for your network (mainnet/testnet)

---

## 🔗 Related Files

- [TESTNET_MODE.md](./TESTNET_MODE.md) - Testnet vs Mainnet configuration
- [src/config/contracts.js](./src/config/contracts.js) - Contract address configuration
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

## 💡 Key Takeaway

**Remember:** Same staking concept, but **completely different smart contracts and tokens**!

- **Regular Staking** = PLR → stkPLR tokens → rewards
- **DAO Governance** = PLR → NFT membership → voting rights

**Never mix the components between these two systems!**
