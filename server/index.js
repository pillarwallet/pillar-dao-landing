import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client as NotionClient } from '@notionhq/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// JSON parser for API routes
app.use(express.json());

// API: health
app.get('/api/hello', (_req, res) => {
  res.json({ name: 'John Doe' });
});

// API: Notion query
app.post('/api/plr-dao-data', async (req, res) => {
  const NOTION_SECRET_KEY = process.env.NOTION_SECRET_KEY || process.env.VITE_NOTION_SECRET_KEY || process.env.NEXT_PUBLIC_NOTION_SECRET_KEY;
  const NOTION_DATABASE = process.env.NOTION_DATABASE || process.env.VITE_NOTION_DATABASE || process.env.NEXT_PUBLIC_NOTION_DATABASE;
  if (!NOTION_SECRET_KEY || !NOTION_DATABASE) return res.status(500).json({ message: 'Notion is not configured' });

  const notion = new NotionClient({ auth: NOTION_SECRET_KEY });
  const body = req?.body || {};
  if (!body?.walletAddress && !body?.email) {
    return res.status(400).json({ data: 'Please provide wallet address or email.' });
  }
  const filter = [];
  if (body.walletAddress) filter.push({ property: 'WalletAddress', rich_text: { equals: body.walletAddress } });
  if (body.email) filter.push({ property: 'Email', rich_text: { equals: body.email } });
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE,
      filter: { or: filter },
      properties: ['Name', 'Address', 'Email', 'WalletType', 'WalletAddress'],
    });
    res.json({ isFormSubmitted: !!response?.results?.length });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// API: Notion create page
app.post('/api/plr-dao-form', async (req, res) => {
  const NOTION_SECRET_KEY = process.env.NOTION_SECRET_KEY || process.env.VITE_NOTION_SECRET_KEY || process.env.NEXT_PUBLIC_NOTION_SECRET_KEY;
  const NOTION_DATABASE = process.env.NOTION_DATABASE || process.env.VITE_NOTION_DATABASE || process.env.NEXT_PUBLIC_NOTION_DATABASE;
  if (!NOTION_SECRET_KEY || !NOTION_DATABASE) return res.status(500).json({ message: 'Notion is not configured' });
  const body = req?.body || {};
  const { name, email, walletType, address1, address2, city, state, country, zipcode, walletAddress } = body;
  if (!name || !email || !address1 || !city || !state || !country || !zipcode || !walletType || !walletAddress) {
    return res.status(400).json({ message: 'Please enter valid input values.' });
  }
  try {
    const notion = new NotionClient({ auth: NOTION_SECRET_KEY });
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE },
      properties: {
        title: [{ type: 'text', text: { content: 'PLR DAO Member' } }],
        Name: [{ type: 'text', text: { content: name } }],
        Email: [{ type: 'text', text: { content: email } }],
        Address1: [{ type: 'text', text: { content: address1 } }],
        Address2: [{ type: 'text', text: { content: address2 || '' } }],
        City: [{ type: 'text', text: { content: city } }],
        State: [{ type: 'text', text: { content: state } }],
        Country: [{ type: 'text', text: { content: country } }],
        Zipcode: [{ type: 'text', text: { content: zipcode } }],
        WalletType: [{ type: 'text', text: { content: walletType } }],
        WalletAddress: [{ type: 'text', text: { content: walletAddress } }],
      },
    });
    res.json({ data: response });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again. If you're using a vpn, please disable it." });
  }
});

// Serve static files
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

