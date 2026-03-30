import React from "react";
import { PRODUCT } from "../constants/product.js";
import { getRank } from "../constants/ranks.js";

export default function DealScreen({ dealPrice, roundCount, onPlayAgain, onViewLeaderboard }) {
  const rank = getRank(dealPrice);
  const savings = PRODUCT.listPrice - dealPrice;
  const discountPercent = Math.round((savings / PRODUCT.listPrice) * 100);

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center py-10 px-5 bg-slate-800/30 border border-slate-700 rounded-2xl">
        <div className="text-6xl mb-4">{rank.emoji}</div>
        <div className="text-3xl font-black text-white mb-2">NEGOTIATION COMPLETE</div>
        <div className="text-5xl font-black text-emerald-400 my-4">${dealPrice}</div>
        <div className="text-sm text-slate-400 mb-6">
          Saved <span className="text-emerald-400">${savings}</span> ({discountPercent}% off) in {roundCount} rounds
        </div>
        <div
          className="inline-block px-6 py-2 rounded text-2xl font-bold mb-6 border-2"
          style={{ color: rank.color, borderColor: rank.color }}
        >
          {rank.emoji} {rank.label}
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          <button 
            className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition transform hover:-translate-y-0.5"
            onClick={onPlayAgain}
          >
            PLAY AGAIN
          </button>
          <button 
            className="px-8 py-3 bg-transparent border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-slate-400 hover:text-slate-100 font-bold rounded-lg transition"
            onClick={onViewLeaderboard}
          >
            VIEW LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
