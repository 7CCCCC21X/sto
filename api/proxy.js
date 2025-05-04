const https = require('https');
const http = require('http');
const { URL } = require('url');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.statusCode = 400;
    res.end('Missing "url" query parameter.');
    return;
  }

  try {
    const parsedUrl = new URL(targetUrl);
    const protocol = parsedUrl.protocol === 'http:' ? http : https;

    const proxyReq = protocol.request(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: parsedUrl.host,
      },
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        ...proxyRes.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.statusCode = 500;
      res.end(`Error fetching ${targetUrl}: ${err.message}`);
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  } catch (err) {
    res.statusCode = 400;
    res.end(`Invalid URL: ${err.message}`);
  }
};
