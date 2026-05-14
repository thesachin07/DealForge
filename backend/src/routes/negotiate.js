import express from "express";
import { negotiateLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// POST /negotiate - Proxy negotiation request to Mistral API
router.post("/", negotiateLimiter, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "MISTRAL_API_KEY missing in server environment" });
    }

    // Forward to Mistral API
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
model: "mistral-small-latest",
        max_tokens: 300,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Negotiate route error:", error);
    res.status(500).json({ error: "Failed to process negotiation", details: error.message });
  }
});

export default router;
