import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ChevronRight } from "lucide-react";
import axios from "axios";
import { API } from "../App";

const QUICK_QUESTIONS = [
  { text: "F1 Tickets 2026", icon: "🏎️" },
  { text: "Champions League", icon: "⚽" },
  { text: "Taylor Swift London", icon: "🎤" },
  { text: "World Cup 2026", icon: "🏆" }
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat/message`, { message: text, session_id: sessionId });
      setSessionId(res.data.session_id);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "We have the verified-seller listings in Europe for F1, football, concerts & World Cup 2026. Browse our events or ask me anything!" }]);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        data-testid="chat-widget-toggle"
        className="fixed bottom-5 right-5 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-[#e10600] to-[#8b0000] rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(225,6,0,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_40px_rgba(225,6,0,0.6)] group-hover:rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#15803d] rounded-full border-2 border-[#0e0e14] animate-pulse" />
        </div>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-[340px] sm:w-[380px] max-w-[calc(100vw-40px)] flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
      style={{ maxHeight: "520px", borderRadius: "16px" }}
      data-testid="chat-widget-window"
    >
      {/* ── Header ── */}
      <div className="relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e10600] via-[#b80500] to-[#8b0000]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-tight">EuroMatch Support</div>
              <div className="text-white/70 text-[11px] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#15803d] rounded-full" />
                Online — instant replies
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            data-testid="chat-widget-close"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0e0e14]"
        style={{ minHeight: "220px" }}
      >
        {messages.length === 0 && (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-[#e10600]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e10600]" />
              </div>
              <div className="bg-[#1a1a24] border border-white/8 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                <p className="text-white/90 text-[13px] leading-relaxed font-medium">
                  Welcome to EuroMatchTickets!
                </p>
                <p className="text-white/50 text-[12px] leading-relaxed mt-1">
                  Find the verified-seller listings for F1, football, concerts & World Cup 2026.
                </p>
              </div>
            </div>
            {/* Quick Questions */}
            <div className="grid grid-cols-2 gap-1.5 pl-9">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  className="flex items-center gap-2 text-left text-[11px] bg-[#1a1a24] hover:bg-[#e10600]/10 text-white/70 hover:text-white px-3 py-2.5 rounded-xl border border-white/6 hover:border-[#e10600]/30 transition-all duration-150 group"
                  data-testid={`quick-question-${i}`}
                >
                  <span className="text-sm">{q.icon}</span>
                  <span className="font-medium truncate">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 bg-[#e10600]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e10600]" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#e10600] text-white rounded-2xl rounded-br-md font-medium"
                  : "bg-[#1a1a24] border border-white/8 text-white/90 rounded-2xl rounded-tl-md"
              }`}
              data-testid={`chat-message-${i}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 bg-[#e10600]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#e10600]" />
            </div>
            <div className="bg-[#1a1a24] border border-white/8 px-4 py-3 rounded-2xl rounded-tl-md">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#e10600] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-[#e10600] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-[#e10600] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="px-3 py-3 bg-[#15151e] border-t border-white/6 flex-shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tickets..."
            className="flex-1 text-[13px] px-4 py-2.5 bg-[#0e0e14] border border-white/8 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#e10600]/50 focus:ring-1 focus:ring-[#e10600]/20 transition-all"
            data-testid="chat-input"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#e10600] hover:bg-[#b80500] disabled:bg-white/5 disabled:text-white/20 text-white px-3.5 py-2.5 rounded-xl transition-all duration-150"
            data-testid="chat-send-button"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[10px] text-white/20 font-medium">Powered by EuroMatchTickets</span>
          <span className="text-[10px] text-white/20 flex items-center gap-1">
            <span className="w-1 h-1 bg-[#15803d] rounded-full" /> Customer support
          </span>
        </div>
      </div>
    </div>
  );
}
