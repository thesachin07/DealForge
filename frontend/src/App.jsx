import React, { useState, useEffect, useRef } from "react";
import ChatArea from "./components/ChatArea";
import ProductCard from "./components/ProductCard";
import TacticsBar from "./components/TacticsBar";
import DealScreen from "./components/DealScreen";
import Leaderboard from "./components/Leaderboard";
import StartScreen from "./components/StartScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import { PRODUCT } from "./constants/product.js";
import { getRank } from "./constants/ranks.js";
import { callMistral } from "./services/mistralApi.jsx";
import { loadLeaderboard, saveToLeaderboard } from "./services/leaderboard.js";
import { parseDeal, cleanMessage, extractPrice } from "./utils/negotiation.js";

export default function App() {
  const [tab, setTab] = useState("game");
  const [phase, setPhase] = useState("start"); // start | playing | done
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(PRODUCT.listPrice);
  const [roundCount, setRoundCount] = useState(0);
  const [dealPrice, setDealPrice] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [myEntryId, setMyEntryId] = useState(null);
  const [user, setUser] = useState(null);
  const [authPhase, setAuthPhase] = useState("login"); // login | register
  const inputRef = useRef(null);

  useEffect(() => {
    loadLeaderboard().then(setLeaderboard);

    // Check for existing authentication
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Authentication functions
  const handleLogin = (userData) => {
    setUser(userData);
    setPlayerName(userData.username);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setPlayerName(userData.username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPhase("start");
    setMessages([]);
    setPlayerName("");
  };

  const startGame = async () => {
    setPhase("playing");
    setMessages([]);
    setCurrentPrice(PRODUCT.listPrice);
    setRoundCount(0);
    setDealPrice(null);
    setMyEntryId(null);
    setIsTyping(true);

    const opening = await callMistral([
      {
        role: "user",
        content: `Start the negotiation. Greet the buyer and present the ${PRODUCT.name} at $${PRODUCT.listPrice}. Be confident and brief.`,
      },
    ]);

    setIsTyping(false);
    setMessages([{ role: "seller", text: cleanMessage(opening), price: PRODUCT.listPrice }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping || phase !== "playing") return;
    const userText = input.trim();
    setInput("");
    const newRound = roundCount + 1;
    setRoundCount(newRound);

    const newMessages = [...messages, { role: "buyer", text: userText }];
    setMessages(newMessages);
    setIsTyping(true);

    const apiMessages = newMessages.map((m) => ({
      role: m.role === "buyer" ? "user" : "assistant",
      content: m.text,
    }));

    if (newRound >= 8) {
      apiMessages.push({
        role: "user",
        content: "[SYSTEM: This is round 8, the final round. Either close the deal at your best price or walk away.]",
      });
    }

    const reply = await callMistral(apiMessages);
    setIsTyping(false);

    const deal = parseDeal(reply);
    const cleanReply = cleanMessage(reply);
    const priceInReply = extractPrice(reply);
    const newPrice = priceInReply || currentPrice;

    if (deal !== null) {
      setDealPrice(deal);
      setCurrentPrice(deal);
      setMessages((prev) => [...prev, { role: "seller", text: cleanReply, price: deal }]);
      // Automatically save score for authenticated user
      setTimeout(() => saveScore(deal), 800);
    } else {
      if (newPrice < currentPrice) setCurrentPrice(newPrice);
      const updated = [...newMessages, { role: "seller", text: cleanReply, price: newPrice }];
      setMessages(updated);

      if (newRound >= 8 && !deal) {
        setMessages((prev) => [
          ...prev,
          { role: "system", text: "⏰ NEGOTIATION ENDED — No deal reached. Try again!" },
        ]);
        setTimeout(() => setPhase("start"), 2000);
      }
    }
  };

  const saveScore = async (price) => {
    if (!user || !price) return;

    const entry = {
      name: user.username,
      price: price,
      savings: PRODUCT.listPrice - price,
      rounds: roundCount,
      rank: getRank(price).label,
    };

    try {
      const updated = await saveToLeaderboard(entry);
      setLeaderboard(updated);
      setPhase("done");
    } catch (error) {
      console.error('Failed to save score:', error);
      
      setPhase("done");
    }
  };

  const submitScore = async () => {
    if (!playerName.trim() || !dealPrice) return;
    const entry = {
      name: playerName.trim().substring(0, 20),
      price: dealPrice,
      savings: PRODUCT.listPrice - dealPrice,
      rounds: roundCount,
      rank: getRank(dealPrice).label,
    };
    const updated = await saveToLeaderboard(entry);
    setLeaderboard(updated);
    setPhase("done");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const applyTactic = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const rank = dealPrice ? getRank(dealPrice) : null;

  // Show authentication screens if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tight mb-2">
            DEAL<span className="text-brand-500">FORGE</span>
          </h1>
          <p className="text-lg text-slate-400">AI Negotiation Arena</p>
        </div>
        {authPhase === "login" ? (
          <LoginScreen
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthPhase("register")}
          />
        ) : (
          <RegisterScreen
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthPhase("login")}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        
        {/* Logout button at top-right corner */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <span className="text-sm text-slate-400">Welcome, {user.username}!</span>
          <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300 hover:bg-red-500/20 transition">
            Logout
          </button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight">
            DEAL<span className="text-brand-500">FORGE</span>
          </h1>
          <p className="text-sm text-slate-400">Beat the Seller, Win the Deal</p>
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
          <button
            className={`flex-1 px-5 py-2 text-sm font-semibold transition rounded ${
              tab === "game"
                ? "bg-brand-500/20 text-brand-200 border border-brand-500/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
            onClick={() => setTab("game")}
          >
             Negotiate
          </button>
          <button
            className={`flex-1 px-5 py-2 text-sm font-semibold transition rounded ${
              tab === "board"
                ? "bg-brand-500/20 text-brand-200 border border-brand-500/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
            onClick={() => {
              setTab("board");
              loadLeaderboard().then(setLeaderboard);
            }}
          >
             Leaderboard
          </button>
        </div>

        {tab === "game" && (
          <>
            {phase === "start" && <StartScreen onStart={startGame} />}

            {phase === "playing" && (
              <div className="w-full max-w-2xl flex flex-col gap-4">
                <ProductCard currentPrice={currentPrice} />

                <div className="flex gap-2 font-mono text-xs">
                  <div className="px-2 py-1 rounded text-slate-400 bg-white/5 border border-white/10">
                    ROUND <span className="text-slate-100">{roundCount}/8</span>
                  </div>
                  <div className="px-2 py-1 rounded text-slate-400 bg-white/5 border border-white/10">
                    SAVED <span className="text-emerald-400">${PRODUCT.listPrice - currentPrice}</span>
                  </div>
                  <div className="px-2 py-1 rounded text-slate-400 bg-white/5 border border-white/10">
                    DISCOUNT <span className="text-emerald-400">
                      {Math.round(((PRODUCT.listPrice - currentPrice) / PRODUCT.listPrice) * 100)}%
                    </span>
                  </div>
                </div>

                <ChatArea messages={messages} isTyping={isTyping} />

                <TacticsBar onTacticClick={applyTactic} />

                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-slate-100 font-sans resize-none outline-none focus:border-brand-500 placeholder-slate-600 min-h-[48px] max-h-[120px]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Make your offer or argue your case..."
                    rows={2}
                    disabled={isTyping}
                  />
                  <button
                    className="px-5 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg whitespace-nowrap transition h-[48px]"
                    onClick={sendMessage}
                    disabled={isTyping || !input.trim()}
                  >
                    SEND
                  </button>
                </div>
              </div>
            )}

            {phase === "done" && dealPrice !== null && rank && (
              <DealScreen
                dealPrice={dealPrice}
                roundCount={roundCount}
                onPlayAgain={() => setPhase("start")}
                onViewLeaderboard={() => {
                  setTab("board");
                  loadLeaderboard().then(setLeaderboard);
                }}
              />
            )}
          </>
        )}

        {tab === "board" && (
          <Leaderboard leaderboard={leaderboard} myEntryId={myEntryId} />
        )}
      </div>
    </>
  );
}
