import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});

export const negotiateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 30, 
  message: "Too many negotiation requests, please slow down.",
});

export const leaderboardLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 50, 
  message: "Too many leaderboard requests.",
});
