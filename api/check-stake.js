export default async function handler(req, res) {
  const { addresses } = req.query;

  // 允许跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!addresses) {
    return res.status(400).json({ error: 'Missing addresses' });
  }

  const list = addresses.split(',').map(a => a.trim()).filter(Boolean);
  const results = {};

  for (const addr of list) {
    try {
      const apiUrl = `https://airdrop.stakestone.io/backend/airdrop/credentials?walletAddress=${addr}`;
      const response = await fetch(apiUrl); // ✅ Node 18 原生 fetch
      const data = await response.json();
      results[addr] = data;
    } catch (error) {
      results[addr] = { error: true, message: error.message };
    }
  }

  return res.status(200).json({ results });
}
