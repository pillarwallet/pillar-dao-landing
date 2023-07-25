const { Client } = require('@notionhq/client');

const NOTION_SECRET_KEY = process.env.NEXT_PUBLIC_NOTION_SECRET_KEY;
const NOTION_DATABASE = process.env.NEXT_PUBLIC_NOTION_DATABASE;

const notion = new Client({ auth: NOTION_SECRET_KEY });

export default async function handleForm(req, res) {
  try {
    if (req.method === 'POST') {
      const body = req.body

      if (!body.Name || !body.Address || !body.Email || !body.Name || !body.WalletType || !body.WalletAddress) {
        res.status(404).json({ message: 'Invalid data request' })
      }

      const response = await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE,
        },
        properties: {
          "title": [{ "type": "text", "text": { "content": "PLR DAO Member" } }],
          "Name": [{ "type": "text", "text": { "content": body.Name } }],
          "Address": [{ "type": "text", "text": { "content": body.Address } }],
          "Email": [{ "type": "text", "text": { "content": body.Email } }],
          "WalletType": [{ "type": "text", "text": { "content": body.WalletType } }],
          "WalletAddress": [{ "type": "text", "text": { "content": body.WalletAddress } }],
        }
      });
      res.status(200).json({ data: response })
    } else {
      res.status(404).json({ message: 'Method not allowed!' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Something went wrong.' })
  }
}