export default async function handler(req, res) {
  const { studioid } = req.query;

  if (!studioid) {
    return res.status(400).json({ error: "Missing studioid" });
  }

  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const TENANT = "sore"; // Ersetze mit deinem Magicline-Tenant

  const url = `https://${TENANT}.api.magicline.com/connect/v1/trialsession?startDate=${startDate}&endDate=${endDate}&studioId=${studioid}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    res.status(200).json({
      name: data.name,
      description: data.description,
      slots: data.slots,
    });
  } catch (error) {
    console.error("Fehler bei Slots:", error);
    res.status(500).json({ error: error.message });
  }
}
