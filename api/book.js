export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const magiclineResponse = await fetch('https://sore.api.magicline.com/connect/v1/trialsession/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Magicline-SORE-Booking' // Optional
      },
      body: JSON.stringify(req.body)
    });

    const result = await magiclineResponse.json();

    if (!magiclineResponse.ok) {
      console.error("Magicline API error:", result);
      return res.status(magiclineResponse.status).json({ error: result });
    }

    return res.status(200).json({ message: 'Buchung erfolgreich', result });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
