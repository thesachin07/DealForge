export function getRank(price) {
  if (price <= 200) return { label: "LEGENDARY", color: "#f59e0b", emoji: "👑" };
  if (price <= 250) return { label: "ELITE", color: "#8b5cf6", emoji: "💎" };
  if (price <= 300) return { label: "EXPERT", color: "#3b82f6", emoji: "🔷" };
  if (price <= 350) return { label: "SKILLED", color: "#10b981", emoji: "⚡" };
  if (price <= 420) return { label: "AVERAGE", color: "#6b7280", emoji: "📊" };
  return { label: "ROOKIE", color: "#ef4444", emoji: "🌱" };
}

export const RANK_TIERS = [
  { label: "LEGENDARY", range: "≤ $200", color: "#f59e0b", emoji: "👑" },
  { label: "ELITE", range: "$201–$250", color: "#8b5cf6", emoji: "💎" },
  { label: "EXPERT", range: "$251–$300", color: "#3b82f6", emoji: "🔷" },
  { label: "SKILLED", range: "$301–$350", color: "#10b981", emoji: "⚡" },
  { label: "AVERAGE", range: "$351–$420", color: "#6b7280", emoji: "📊" },
  { label: "ROOKIE", range: "> $420", color: "#ef4444", emoji: "🌱" },
];
