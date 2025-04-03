export default async function handler(req, res) {
  const { addresses } = req.query;

  if (!addresses) return res.status(400).json({ error: 'Missing addresses' });

  const list = addresses.split(',').map(a => a.trim()).filter(Boolean);
  const results = {};

  for (const addr of list) {
    try {
      const apiUrl = `https://airdrop.stakestone.io/backend/airdrop/credentials?walletAddress=${addr}`;
      const response = await fetch(apiUrl);  // ✅ 直接用内置 fetch，不引入 node-fetch
      const data = await response.json();
      results[addr] = data;
    } catch (error) {
      results[addr] = { error: true, message: error.message };
    }
  }

  res.status(200).json({ results });
}
