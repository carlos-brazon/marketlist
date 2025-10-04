import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
