// Cloudflare Pages Function: POST /api/plr-dao-data
// Expects environment variables: NOTION_SECRET_KEY, NOTION_DATABASE

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body?.walletAddress && !body?.email) {
      return new Response(JSON.stringify({ data: 'Please provide wallet address or email.' }), { status: 400 });
    }

    const filter = [];
    if (body.walletAddress) filter.push({ property: 'WalletAddress', rich_text: { equals: body.walletAddress } });
    if (body.email) filter.push({ property: 'Email', rich_text: { equals: body.email } });

    if (!env.NOTION_SECRET_KEY || !env.NOTION_DATABASE) {
      return new Response(JSON.stringify({ message: 'Notion is not configured' }), { status: 500 });
    }

    const notionRes = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_DATABASE}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.NOTION_SECRET_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filter: { or: filter } }),
    });
    const data = await notionRes.json();
    return new Response(JSON.stringify({ isFormSubmitted: !!data?.results?.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: 'Something went wrong!' }), { status: 500 });
  }
};

