export default async function handler(req, res) {
  // Allow CORS from anywhere (needed for Claude artifacts)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { what, where } = req.query;

  const APP_ID = process.env.ADZUNA_APP_ID;
  const APP_KEY = process.env.ADZUNA_APP_KEY;

  if (!APP_ID || !APP_KEY) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  const params = new URLSearchParams({
    app_id: APP_ID,
    app_key: APP_KEY,
    results_per_page: 15,
    what: what || "marketing",
    content_type: "application/json",
  });
  if (where) params.set("where", where);

  try {
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/fi/search/1?${params.toString()}`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch from Adzuna" });
  }
}
