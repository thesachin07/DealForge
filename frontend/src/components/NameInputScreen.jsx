import React from "react";
import { PRODUCT } from "../constants/product.js";
import { getRank } from "../constants/ranks.js";

export default function NameInputScreen({ dealPrice, playerName, onNameChange, onSubmit, onSkip }) {
  const rank = getRank(dealPrice);

  return (
    <div className="name-input-screen">
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
      <div className="deal-title">DEAL CLOSED!</div>
      <div className="deal-price">${dealPrice}</div>
      <div className="deal-saving">
        You saved <span>${PRODUCT.listPrice - dealPrice}</span> off the list price!
      </div>
      <div style={{ marginBottom: "24px" }}>
        <div
          className="rank-badge"
          style={{ color: rank.color, borderColor: rank.color }}
        >
          {rank.emoji} {rank.label}
        </div>
      </div>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "4px" }}>
        Enter your name for the leaderboard
      </p>
      <input
        className="name-input"
        placeholder="Your name..."
        value={playerName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        maxLength={20}
        autoFocus
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
        <button className="new-game-btn" onClick={onSubmit} disabled={!playerName.trim()}>
          SUBMIT SCORE
        </button>
        <button className="new-game-btn secondary" onClick={onSkip}>
          SKIP
        </button>
      </div>
    </div>
  );
}
