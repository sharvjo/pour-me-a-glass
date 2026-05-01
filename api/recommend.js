export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API error:", response.status, data);
      return res.status(response.status).json(data);
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("API call failed:", err);
    res.status(500).json({ error: "API call failed", detail: err.message });
  }
}
