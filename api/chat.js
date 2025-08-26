module.exports = async (req, res) => {
  // CORS básico
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    return res.status(500).json({ error: 'Missing N8N_WEBHOOK_URL environment variable' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    let body;
    try { body = raw ? JSON.parse(raw) : {}; } catch (e) { body = {}; }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream error', detail: text });
    }

    if (contentType.includes('application/json')) {
      return res.status(200).json(JSON.parse(text));
    }
    // Si no es JSON, devolver texto envuelto
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Proxy error' });
  }
};
