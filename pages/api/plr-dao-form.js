const { Client } = require('@notionhq/client');

const NOTION_SECRET_KEY = process.env.NEXT_NOTION_SECRET_KEY;
const NOTION_DATABASE = process.env.NEXT_NOTION_DATABASE;

const notion = new Client({ auth: NOTION_SECRET_KEY });

const handleForm = async (req, res) => {
  try {
    if (req.method === 'POST') {
      if (!req?.body) return res.status(404).json({ message: 'Please enter valid input values.' });

      const {
        name,
        email,
        walletType,
        address1,
        address2,
        city,
        state,
        country,
        zipcode,
        walletAddress,
      } = req?.body;

      if (!name || !email || !address1 || !city || !state || !country || !zipcode || !walletType || !walletAddress) {
        return res.status(404).json({ message: 'Please enter valid input values.' })
      }

      const response = await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE,
        },
        properties: {
          "title": [{ "type": "text", "text": { "content": "PLR DAO Member" } }],
          "Name": [{ "type": "text", "text": { "content": name } }],
          "Email": [{ "type": "text", "text": { "content": email } }],
          "Address1": [{ "type": "text", "text": { "content": address1 } }],
          "Address2": [{ "type": "text", "text": { "content": address2 || '' } }],
          "City": [{ "type": "text", "text": { "content": city } }],
          "State": [{ "type": "text", "text": { "content": state } }],
          "Country": [{ "type": "text", "text": { "content": country } }],
          "Zipcode": [{ "type": "text", "text": { "content": zipcode } }],
          "WalletType": [{ "type": "text", "text": { "content": walletType } }],
          "WalletAddress": [{ "type": "text", "text": { "content": walletAddress } }],
        }
      });
      return res.status(200).json({ data: response })
    } else {
      return res.status(404).json({ message: 'Method not allowed!' });
    }
  } catch (error) {
    return res.status(404).json({ message: 'Something went wrong. Please try again.' })
  }
}

export default handleForm;
