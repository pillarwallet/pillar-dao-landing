const { Client } = require('@notionhq/client');

const NOTION_SECRET_KEY = 'secret_Q2oNtNIPK2eaAuurEhsGgdNg5nS1iOeDDPxDyfWWMKE';
const NOTION_DATABASE = 'b076399f028f4d5ab3482f855172e566';

const notion = new Client({ auth: NOTION_SECRET_KEY });
export default async function handleForm(req, res) {
  if (req.method === 'POST') {
    const body = req.body

    if (!body.Name || !body.Email || !body.Name || !body.Wallet || !body.Address) {
      return res.json({ data: 'First or last name not found' })
    }

    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE,
      },
      properties: {
        "title": [{ "type": "text", "text": { "content": "PLR DAO Member" } }],
        "Name": [{ "type": "text", "text": { "content": body.Name } }],
        "Email": [{ "type": "text", "text": { "content": body.Email } }],
        "Wallet": [{ "type": "text", "text": { "content": body.Wallet } }],
        "Address": [{ "type": "text", "text": { "content": body.Address } }],
      }
    });
    res.json({ data: response })
  } else {
    return res.status(404).json({ message: 'Method not allowed!' })

  }
}