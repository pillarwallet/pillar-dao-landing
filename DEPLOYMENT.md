# Deployment Guide

This project can be deployed to multiple platforms. The form APIs (`/api/plr-dao-form` and `/api/plr-dao-data`) work on all platforms.

## ✅ How Frontend Connects to APIs

**All platforms work the same way from the frontend's perspective:**

The frontend code uses **relative URLs** for API calls:
```javascript
fetch('/api/plr-dao-form', { ... })  // No hardcoded URLs!
```

When you run `npm start`, the Express server:
1. Serves the React app (from `dist/`)
2. Handles API routes (`/api/*`)
3. **Everything runs on the same origin** (same domain/port)

**No CORS issues. No URL configuration. It just works.** ✨

---

## 🚀 Deployment Options

### 1. Cloudflare Pages (Recommended)

**Why?** Free, fast CDN, built-in serverless functions, automatic HTTPS.

**Setup:**

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
# The 'functions' directory is automatically detected
```

**Environment Variables (Set in Cloudflare Dashboard):**
```env
NOTION_SECRET_KEY=ntn_xxx...
NOTION_DATABASE=xxx...
```

**How it works:**
- Static files served from `dist/` folder
- API routes handled by `functions/api/plr-dao-form.js` and `functions/api/plr-dao-data.js`
- Cloudflare automatically routes `/api/*` requests to the functions

**Deployment Steps:**
1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare dashboard
5. Deploy!

---

### 2. VPS or Coolify (Self-Hosted)

**Why?** Full control, can use Docker, works with any VPS provider.

**Setup:**

```bash
# Install dependencies (includes express)
npm install

# Build the frontend
npm run build

# Start the server (serves static files + API)
npm start
```

**Environment Variables (.env file or system env):**
```env
# Notion API (required)
NOTION_SECRET_KEY=ntn_xxx...
NOTION_DATABASE=xxx...

# Alternative: use VITE_ prefix (also works)
VITE_NOTION_SECRET_KEY=ntn_xxx...
VITE_NOTION_DATABASE=xxx...

# Server port (optional, defaults to 3000)
PORT=3000
```

**How it works:**
- Express server (`server/index.js`) serves the built React app from `dist/`
- API routes (`/api/plr-dao-form`, `/api/plr-dao-data`) handled by Express
- All requests to non-API routes serve `index.html` (SPA routing)

**Coolify Setup:**
1. Create new service → Node.js
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy!

**Docker (Optional):**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t pillar-dao .
docker run -p 3000:3000 --env-file .env pillar-dao
```

---

### 3. Render / Railway (One-Click Deploy)

**Why?** Easy Docker-based hosting, free tier available, auto-deploy from Git.

**Setup (Render):**

1. Connect your GitHub repo
2. Select "Web Service"
3. Settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Add environment variables:
   - `NOTION_SECRET_KEY`
   - `NOTION_DATABASE`
5. Deploy!

**Setup (Railway):**

1. Click "New Project" → "Deploy from GitHub"
2. Railway auto-detects `nixpacks.toml` and configures everything
3. Add environment variables in dashboard
4. Deploy!

**How it works:**
- Uses the included `Dockerfile` or `nixpacks.toml`
- Runs `npm start` to launch Express server
- Serves React app + API routes on same origin
- Auto-restarts on crashes

**Files included:**
- ✅ `Dockerfile` - Multi-stage build for Docker
- ✅ `nixpacks.toml` - Railway/Render with Nixpacks
- ✅ `.dockerignore` - Optimized Docker builds

---

### 4. Vercel (Serverless)

**Why?** Free tier, excellent for Next.js-style projects, automatic deployments.

**Setup:**

1. Connect your GitHub repo to Vercel
2. Vercel auto-detects the build settings
3. Add environment variables in Vercel dashboard:
   - `NOTION_SECRET_KEY` or `VITE_NOTION_SECRET_KEY`
   - `NOTION_DATABASE` or `VITE_NOTION_DATABASE`
4. Deploy!

**How it works:**
- Serves static files from `dist/`
- Your existing `pages/api/*.js` files work as serverless functions
- Vercel automatically routes `/api/*` requests to these functions
- **No Express server needed** - Vercel handles it

---

### 5. GitHub Actions (CI/CD)

**Why?** Automated deployments on every push.

**Create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: pillar-dao
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## 📋 Environment Variables Summary

### Required for All Deployments

| Variable | Purpose | Example |
|----------|---------|---------|
| `NOTION_SECRET_KEY` | Notion API key | `ntn_xxx...` |
| `NOTION_DATABASE` | Notion database ID | `123a1234...` |

**Alternative naming (also supported):**
- `VITE_NOTION_SECRET_KEY` (used in dev)
- `VITE_NOTION_DATABASE` (used in dev)

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | Server port (VPS only) |
| `VITE_USE_TESTNET` | `false` | Use Polygon Amoy testnet |
| `VITE_PRIVY_APP_ID` | - | Privy authentication |
| `VITE_WALLET_CONNECT_PROJECT_ID` | - | WalletConnect |
| `VITE_INFURA_ID` | - | Infura RPC endpoints |

---

## 🧪 Testing Your Deployment

After deploying, test the form APIs:

### Test Form Submission
```bash
curl -X POST https://your-domain.com/api/plr-dao-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "address1": "123 Main St",
    "city": "City",
    "state": "ST",
    "country": "Country",
    "zipcode": "12345",
    "walletType": "Wallet",
    "walletAddress": "0x1234567890123456789012345678901234567890"
  }'
```

**Expected response:**
```json
{"data": {...}}
```

### Test Form Data Query
```bash
curl -X POST https://your-domain.com/api/plr-dao-data \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0x1234567890123456789012345678901234567890"}'
```

**Expected response:**
```json
{"isFormSubmitted": true}
```

---

## 🐛 Troubleshooting

### "Notion is not configured" Error
- **Cloudflare:** Set environment variables in Cloudflare Pages dashboard
- **VPS:** Create `.env` file or set system environment variables
- **Check:** Variable names must be exact (case-sensitive)

### 404 on API Routes
- **Cloudflare:** Ensure `functions/` directory is in your repo
- **VPS:** Check that Express server is running (`npm start`)
- **Both:** Verify build completed successfully

### SPA Routing Issues (404 on refresh)
- **Cloudflare:** Should work automatically
- **VPS:** Express catch-all route should handle this
- **Nginx/Apache:** Need rewrite rules to serve `index.html`

### "Failed to fetch" Error
- Check browser console for CORS errors
- Verify API endpoint URL is correct (relative paths like `/api/...` recommended)
- Check network tab for actual error response

---

**All platforms**: Frontend auto-connects to APIs via relative URLs (`/api/*`). Just run `npm start`!

---

## 🔄 Migration from Next.js

This project was migrated from Next.js to Vite + React Router. The APIs work differently now:

| Next.js | Current (Vite) |
|---------|----------------|
| `pages/api/plr-dao-form.js` | **Dev:** `vite.config.js` middleware<br>**Cloudflare:** `functions/api/plr-dao-form.js`<br>**VPS:** `server/index.js` |
| API Routes auto-deployed | Must use serverless functions or Express |
| `process.env.NEXT_PUBLIC_*` | `process.env.VITE_*` or plain `process.env.*` |

**All implementations are equivalent** - they handle the same requests and return the same responses.
