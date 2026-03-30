import React from "react";
import { RANK_TIERS, getRank } from "../constants/ranks.js";

export default function Leaderboard({ leaderboard, myEntryId }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-2xl font-bold text-white">Global Leaderboard</div>
          <div className="text-xs font-mono text-slate-500">Shared across all players · Lowest price wins</div>
        </div>
        <div className="text-xs font-mono text-slate-500">
          TOP {leaderboard.length}
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-mono text-sm">
          <div className="text-4xl mb-3">🏆</div>
          <div>No deals yet. Be the first to negotiate!</div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {leaderboard.map((entry, i) => {
            const r = getRank(entry.price);
            const isMe = entry.id === myEntryId;
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition ${
                  isMe
                    ? "bg-brand-500/10 border-brand-500/25"
                    : "bg-slate-800/20 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className={`text-sm font-mono ${i < 3 ? "text-amber-400 font-bold" : "text-slate-500"}`}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-100">
                    {entry.name}{" "}
                    {isMe && (
                      <span className="text-xs font-mono text-brand-400">← YOU</span>
                    )}
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-500">{entry.rounds}r</div>
                <div
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}40` }}
                >
                  {r.label}
                </div>
                <div className="text-base font-bold text-emerald-400 min-w-[60px] text-right">${entry.price}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 p-4 bg-slate-800/20 border border-slate-700 rounded-lg">
        <div className="text-xs font-mono text-slate-500 mb-3 tracking-widest">RANK TIERS</div>
        <div className="space-y-1">
          {RANK_TIERS.map((t) => (
            <div key={t.label} className="flex justify-between text-xs font-mono pb-1 border-b border-slate-700/50 last:border-0">
              <span style={{ color: t.color }}>
                {t.emoji} {t.label}
              </span>
              <span className="text-slate-500">{t.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
