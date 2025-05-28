
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const TENANT = "sore"; // Ersetze 'sore' mit deinem tatsächlichen Magicline-Tenant

router.get("/slots", async (req, res) => {
  const studioId = req.query.studioid;

  if (!studioId) {
    return res.status(400).json({ error: "Missing studioid" });
  }

  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = `https://${TENANT}.api.magicline.com/connect/v1/trialsession?startDate=${startDate}&endDate=${endDate}&studioId=${studioId}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    res.json({
      name: data.name,
      description: data.description,
      slots: data.slots,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Slots:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
