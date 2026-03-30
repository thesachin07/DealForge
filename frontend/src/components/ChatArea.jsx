import React, { useRef, useEffect } from "react";

export default function ChatArea({ messages, isTyping }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="h-[360px] w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-800/30 p-4 flex flex-col gap-3 scrollbar-thin" ref={chatRef}>
      {messages.map((m, i) => (
        <div key={i} className={`flex flex-col ${m.role === "seller" ? "items-start" : m.role === "buyer" ? "items-end" : "items-center"}`}>
          <div className={`text-xs font-mono tracking-wider mb-1 ${
            m.role === "seller" ? "text-brand-500" : m.role === "buyer" ? "text-emerald-400 text-right" : "text-amber-400"
          }`}>
            {m.role === "seller" ? "ARIA · AI SELLER" : m.role === "buyer" ? "YOU" : ""}
          </div>
          <div className={`px-3.5 py-2.5 rounded-lg text-sm border ${
            m.role === "seller" 
              ? "bg-brand-500/10 border-brand-500/25 text-brand-100 rounded-bl-none" 
              : m.role === "buyer"
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200 rounded-br-none"
              : "bg-amber-500/10 border-amber-500/20 text-amber-200 w-full"
          }`}>
            {m.text}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex flex-col items-start">
          <div className="text-xs font-mono tracking-wider text-brand-500 mb-1">ARIA · AI SELLER</div>
          <div className="flex gap-1 px-3.5 py-2.5 bg-brand-500/10 border border-brand-500/25 rounded-lg rounded-bl-none">
            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
            <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
          </div>
        </div>
      )}
    </div>
  );
}
