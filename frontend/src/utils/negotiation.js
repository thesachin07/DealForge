import { PRODUCT } from "../constants/product.js";

export function parseDeal(text) {
  const match = text.match(/DEAL_CONFIRMED:\$(\d+(\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  return null;
}

export function cleanMessage(text) {
  return text.replace(/DEAL_CONFIRMED:\$[\d.]+/g, "").trim();
}

export function extractPrice(text) {
  const matches = [...text.matchAll(/\$(\d{2,3}(?:\.\d{2})?)/g)];
  if (matches.length === 0) return null;
  const prices = matches
    .map(m => parseFloat(m[1]))
    .filter(p => p >= PRODUCT.minPrice && p <= PRODUCT.listPrice);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}
