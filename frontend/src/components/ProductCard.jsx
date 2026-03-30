import React from "react";
import { PRODUCT } from "../constants/product.js";

export default function ProductCard({ currentPrice }) {
  const hasDiscount = currentPrice < PRODUCT.listPrice;
  const isImageUrl = PRODUCT.image.startsWith("/");

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-5 flex items-center gap-5">
      <div className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 overflow-hidden">
        {isImageUrl ? (
          <img src={PRODUCT.image} alt={PRODUCT.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-5xl">{PRODUCT.image}</div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-white mb-1">{PRODUCT.name}</h2>
        <p className="text-xs text-slate-400 leading-relaxed">{PRODUCT.description}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-mono text-slate-400 mb-1">
          {hasDiscount ? "CURRENT OFFER" : "LIST PRICE"}
        </div>
        <div className={`text-2xl font-bold ${hasDiscount ? "text-emerald-400" : "text-white"}`}>
          ${currentPrice}
        </div>
        {hasDiscount && <div className="text-sm line-through text-slate-600">${PRODUCT.listPrice}</div>}
      </div>
    </div>
  );
}
