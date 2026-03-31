import express from "express";
import Score from "../models/Score.js";
import { leaderboardLimiter } from "../middleware/rateLimit.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /leaderboard - Retrieve all scores sorted by price (lowest first)
router.get("/", leaderboardLimiter, async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('user', 'username')
      .sort({ price: 1 })
      .limit(50);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// POST /leaderboard - Save a new score (requires authentication)
router.post("/", leaderboardLimiter, authenticateToken, async (req, res) => {
  try {
    const { name, price, savings, rounds, rank } = req.body;

    // Validate input
    if (!name || !price || rounds === undefined || !rank) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const score = new Score({
      user: req.user._id,
      name,
      price,
      savings,
      rounds,
      rank
    });
    await score.save();

    // Return updated leaderboard
    const scores = await Score.find()
      .populate('user', 'username')
      .sort({ price: 1 })
      .limit(50);
    res.status(201).json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

// GET /leaderboard/user - Get user's personal scores
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ price: 1 })
      .limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user scores" });
  }
});

export default router;
