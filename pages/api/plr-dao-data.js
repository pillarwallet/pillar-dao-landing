const { Client } = require('@notionhq/client');

const NOTION_SECRET_KEY = process.env.NEXT_PUBLIC_NOTION_SECRET_KEY;
const NOTION_DATABASE = process.env.NEXT_PUBLIC_NOTION_DATABASE;

const notion = new Client({ auth: NOTION_SECRET_KEY });

export default async function handleData(req, res) {
  const body = req.body;

  if (!body.walletAddress) {
    return res.status(404).json({ data: 'Please provide wallet address.' })
  }

  try {
    if (req.method === 'POST') {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASE,
        filter: {
          property: 'WalletAddress',
          rich_text: {
            equals: body.walletAddress
          },
        },
        properties: ['Name', 'Address', 'Email', 'WalletType', 'WalletAddress'],
      });

      const tableData = response.results.map((item) => {
        const field1Value = item.properties['Name']?.title?.[0]?.plain_text;
        const field2Value = item.properties['Address']?.rich_text?.[0]?.plain_text;
        const field3Value = item.properties['Email']?.rich_text?.[0]?.plain_text;
        const field4Value = item.properties['WalletType']?.rich_text?.[0]?.plain_text;
        const field5Value = item.properties['WalletAddress']?.rich_text?.[0]?.plain_text;

        return {
          Name: field1Value,
          Address: field2Value,
          Address: field3Value,
          Address: field4Value,
          Address: field5Value,
        };
      });
      return res.status(200).json({ data: tableData })
    } else {
      return res.status(404).json({ message: 'Method not allowed!' });
    }
  } catch (error) {
    return res.status(404).json({ message: 'Something went wrong!' });
  }
}