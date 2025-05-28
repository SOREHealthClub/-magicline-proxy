export default async function handler(req, res) {
  const studioId = req.query.studioId || '1210005170';

  try {
    const response = await fetch(`https://sore.api.magicline.com/connect/v1/studios/${studioId}/trial-sessions/slots`, {
      method: 'GET',
      headers: {
        'X-Tenant': 'sore',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}