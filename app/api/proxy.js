export default async function handler(req, res) {
    try {
      const response = await fetch("https://www.instagram.com/canaanpetresort/?hl=en", {
        headers: {
          "User-Agent": "Mozilla/5.0", // Mimic a real browser request
        },
      });
  
      const html = await response.text();
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Instagram page" });
    }
  }
  