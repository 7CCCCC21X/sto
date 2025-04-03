export default async function handler(req, res) {
  const { addresses } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!addresses) {
    console.log("❌ Missing addresses in query.");
    return res.status(400).json({ error: 'Missing addresses' });
  }

  const list = addresses.split(',').map(a => a.trim()).filter(Boolean);
  const results = {};

  console.log("📦 开始处理地址列表：", list);

  for (const addr of list) {
    const apiUrl = `https://airdrop.stakestone.io/backend/airdrop/credentials?walletAddress=${addr}`;
    try {
      console.log(`🔍 Fetching: ${apiUrl}`);
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(`✅ 成功获取数据: ${addr}`, data);
      results[addr] = data;
    } catch (error) {
      console.error(`❌ 请求失败: ${addr}`, error);
      results[addr] = { error: true, message: error.message };
    }
  }

  res.status(200).json({ results });
}
