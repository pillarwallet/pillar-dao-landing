# Quick Deploy Reference

## TL;DR

**Frontend auto-connects to APIs.** No URL config needed. ✅

```javascript
// This works everywhere:
fetch('/api/plr-dao-form', { ... })
```

## Platform Commands

### Cloudflare Pages
```bash
# Just connect GitHub repo in dashboard
# Build: npm run build
# Output: dist
```

### Vercel
```bash
# Just connect GitHub repo in dashboard
# Auto-detected
```

### Railway
```bash
# Just connect GitHub repo
# Auto-detects nixpacks.toml
```

### Render
```bash
# Build: npm run build
# Start: npm start
```

### Docker (anywhere)
```bash
docker build -t pillar-dao .
docker run -p 3000:3000 --env-file .env pillar-dao
```

### VPS/Coolify
```bash
npm install
npm run build
npm start
```

## Required Environment Variables

**ALL platforms need these:**

```env
NOTION_SECRET_KEY=ntn_xxx...
NOTION_DATABASE=xxx...
```

**Optional (for wallet features):**

```env
VITE_WALLET_CONNECT_PROJECT_ID=xxx...
VITE_INFURA_ID=xxx...
VITE_USE_TESTNET=false
```

## How It Works

```
User visits: https://your-site.com/plr-dao-staking
                     ↓
              Loads React app
                     ↓
User submits form →  POST /api/plr-dao-form
                     ↓
              Same origin = no CORS!
                     ↓
           Saves to Notion DB ✅
```

**All platforms serve both frontend + API on the same domain.**

## API Implementations by Platform

| Platform | Uses |
|----------|------|
| Cloudflare | `functions/api/*.js` |
| Vercel | `pages/api/*.js` |
| Railway/Render/VPS | `server/index.js` |

All do the same thing. Frontend doesn't care which one.

## Test Your Deployment

```bash
# Health check
curl https://your-site.com/api/hello

# Test form API
curl -X POST https://your-site.com/api/plr-dao-form \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","address1":"123 Main","city":"City","state":"ST","country":"US","zipcode":"12345","walletType":"Wallet","walletAddress":"0x1234567890123456789012345678901234567890"}'
```

## Troubleshooting

**"Notion is not configured"**
→ Add env vars in platform dashboard

**404 on /api routes**
→ Check deployment logs, ensure build succeeded

**"Failed to fetch"**
→ Check browser console, verify API URL is relative (`/api/...`)

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full details.
