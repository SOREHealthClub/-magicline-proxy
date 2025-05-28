export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch(
      `https://sore.api.magicline.com/connect/v1/trialsession/book`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant": "sore", // Falls du `sore` als Tenant-ID nutzt – sonst anpassen!
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Book error:", error);
    return res.status(500).json({ error: "Interner Serverfehler" });
  }
}
