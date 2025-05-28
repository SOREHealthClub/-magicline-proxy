const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TENANT = 'sore';
const BASE_URL = 'https://connectapi.magicline.com';

app.get('/appointments', async (req, res) => {
  const studioId = req.query.studioId;
  if (!studioId) return res.status(400).json({ error: 'Missing studioId' });

  try {
    const response = await fetch(`${BASE_URL}/studios/${studioId}/trial-sessions/slots`, {
      headers: {
        'X-Tenant': TENANT,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    const slots = data.map(slot => ({
      id: slot.id,
      date: new Date(slot.startDateTime).toLocaleDateString('de-DE'),
      time: new Date(slot.startDateTime).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    }));
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/book', async (req, res) => {
  const { firstName, lastName, email, phone, appointment } = req.body;
  if (!firstName || !lastName || !email || !phone || !appointment) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const response = await fetch(`${BASE_URL}/trial-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant': TENANT,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        slotId: appointment
      })
    });

    if (response.ok) {
      res.json({ success: true });
    } else {
      const errorData = await response.json();
      res.status(500).json({ success: false, message: errorData.message || 'Booking failed' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Magicline Proxy läuft auf Port ${PORT}`);
});
