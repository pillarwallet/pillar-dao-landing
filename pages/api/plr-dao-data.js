const { Client } = require('@notionhq/client');

const NOTION_SECRET_KEY = process.env.NEXT_PUBLIC_NOTION_SECRET_KEY;
const NOTION_DATABASE = process.env.NEXT_PUBLIC_NOTION_DATABASE;

const notion = new Client({ auth: NOTION_SECRET_KEY });

export default async function handleData(req, res) {
  const { walletAddress, email } = req.body;

  if (!walletAddress && !email) {
    return res.status(404).json({ data: 'Please provide wallet address or email.' })
  }

  var filterCondition = [];
  if (walletAddress) {
    filterCondition.push({
      property: 'WalletAddress',
      rich_text: {
        equals: walletAddress
      },
    });
  }

  if(email) {
    filterCondition.push({
      property: 'Email',
      rich_text: {
        equals: email
      },
    });
  }

  try {
    if (req.method === 'POST') {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE,
        filter: {
          or: filterCondition,
        },
        properties: ['Name', 'Address', 'Email', 'WalletType', 'WalletAddress'],
      });

      return res.status(200).json({ isFormSubmitted: !!response?.results?.length })
    } else {
      return res.status(404).json({ message: 'Method not allowed!' });
    }
  } catch (error) {
    return res.status(404).json({ message: 'Something went wrong!' });
  }
}