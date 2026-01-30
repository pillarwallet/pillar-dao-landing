// Cloudflare Pages Function: POST /api/plr-dao-form
// Expects environment variables: NOTION_SECRET_KEY, NOTION_DATABASE

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, walletType, address1, address2, city, state, country, zipcode, walletAddress } = body || {};
    if (!name || !email || !address1 || !city || !state || !country || !zipcode || !walletType || !walletAddress) {
      return new Response(JSON.stringify({ message: 'Please enter valid input values.' }), { status: 400 });
    }

    if (!env.NOTION_SECRET_KEY || !env.NOTION_DATABASE) {
      return new Response(JSON.stringify({ message: 'Notion is not configured' }), { status: 500 });
    }

    const notionRes = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NOTION_SECRET_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: env.NOTION_DATABASE },
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
      }),
    });
    const data = await notionRes.json();
    return new Response(JSON.stringify({ data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Something went wrong. Please try again. If you're using a vpn, please disable it." }),
      { status: 500 },
    );
  }
};

