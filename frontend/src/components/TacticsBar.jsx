import React from "react";
import { TACTICS } from "../constants/product.js";

export default function TacticsBar({ onTacticClick }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TACTICS.map((t, i) => (
        <button
          key={i}
          className="px-2.5 py-1.5 bg-white/5 hover:bg-brand-500/10 border border-white/10 hover:border-brand-500/30 text-slate-400 hover:text-brand-300 text-xs font-mono tracking-wide rounded transition"
          onClick={() => onTacticClick(t.text)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
