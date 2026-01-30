import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Client as NotionClient } from '@notionhq/client';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      {
        name: 'api-middleware',
        configureServer(server) {
      process.env.VITE_NOTION_SECRET_KEY = env.VITE_NOTION_SECRET_KEY;
      process.env.VITE_NOTION_DATABASE = env.VITE_NOTION_DATABASE;

      const getBody = async (req) =>
        await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', (chunk) => (data += chunk));
          req.on('end', () => {
            try {
              resolve(data ? JSON.parse(data) : {});
            } catch (e) {
              resolve({});
            }
          });
          req.on('error', reject);
        });

      const notion = new NotionClient({ auth: process.env.VITE_NOTION_SECRET_KEY });
      const NOTION_DATABASE = process.env.VITE_NOTION_DATABASE;

      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/hello') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ name: 'John Doe' }));
          return;
        }

        if (req.url === '/api/plr-dao-data' && req.method === 'POST') {
          try {
            const body = await getBody(req);
            if (!NOTION_DATABASE) {
              res.statusCode = 500;
              res.end(JSON.stringify({ message: 'Notion is not configured' }));
              return;
            }
            if (!body?.walletAddress && !body?.email) {
              res.statusCode = 400;
              res.end(JSON.stringify({ data: 'Please provide wallet address or email.' }));
              return;
            }
            const filter = [];
            if (body.walletAddress) {
              filter.push({ property: 'WalletAddress', rich_text: { equals: body.walletAddress } });
            }
            if (body.email) {
              filter.push({ property: 'Email', rich_text: { equals: body.email } });
            }
            const response = await notion.databases.query({
              database_id: NOTION_DATABASE,
              filter: { or: filter },
              properties: ['Name', 'Address', 'Email', 'WalletType', 'WalletAddress'],
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ isFormSubmitted: !!response?.results?.length }));
            return;
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Something went wrong!' }));
            return;
          }
        }

        if (req.url === '/api/plr-dao-form' && req.method === 'POST') {
          try {
            const body = await getBody(req);
            if (!NOTION_DATABASE) {
              res.statusCode = 500;
              res.end(JSON.stringify({ message: 'Notion is not configured' }));
              return;
            }
            const { name, email, walletType, address1, address2, city, state, country, zipcode, walletAddress } = body || {};
            if (!name || !email || !address1 || !city || !state || !country || !zipcode || !walletType || !walletAddress) {
              res.statusCode = 400;
              res.end(JSON.stringify({ message: 'Please enter valid input values.' }));
              return;
            }
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
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ data: response }));
            return;
          } catch (e) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({ message: "Failed to save to database. Please check configuration and try again." })
            );
            return;
          }
        }

        next();
      });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@images': path.resolve(__dirname, './src/assets/images'),
        '@css': path.resolve(__dirname, './src/assets/css'),
        '@services': path.resolve(__dirname, './src/services'),
        '@config': path.resolve(__dirname, './src/config'),
        '@data': path.resolve(__dirname, './src/data'),
        '@styles': path.resolve(__dirname, './src/styles'),
        'wagmi-config': path.resolve(__dirname, './wagmi-config.js'),
      },
    },
    define: {
      // Make process.env available for compatibility with existing code
      'process.env': {},
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'web3-vendor': ['ethers', 'wagmi', 'viem', 'etherspot'],
            'ui-vendor': ['styled-components'],
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ['@etherspot/react-transaction-buidler'],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
  };
});
