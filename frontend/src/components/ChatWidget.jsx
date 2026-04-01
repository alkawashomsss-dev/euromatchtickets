import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Ticket } from "lucide-react";
import axios from "axios";
import { API } from "../App";

const QUICK_QUESTIONS = [
  "What's the cheapest F1 race?",
  "Champions League tickets?",
  "Taylor Swift 2026 dates?",
  "World Cup 2026 prices?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat/message`, {
        message: text,
        session_id: sessionId,
      });
      setSessionId(res.data.session_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Welcome! We have the cheapest tickets in Europe for F1, football, concerts & World Cup 2026. How can I help?",
        },
      ]);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        data-testid="chat-widget-toggle"
        className="fixed bottom-5 right-5 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      style={{ maxHeight: "500px" }}
      data-testid="chat-widget-window"
    >
      {/* Header */}
      <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          <div>
            <div className="font-semibold text-sm">Ticket Assistant</div>
            <div className="text-emerald-100 text-xs">Online now</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          data-testid="chat-widget-close"
          className="hover:bg-emerald-700 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        style={{ minHeight: "200px" }}
      >
        {messages.length === 0 && (
          <div className="text-center space-y-3">
            <p className="text-slate-500 text-sm">
              Hi! I can help you find tickets for F1, football, concerts &
              more.
            </p>
            <div className="space-y-1.5">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left text-xs bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
                  data-testid={`quick-question-${i}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-br-sm"
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}
              data-testid={`chat-message-${i}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl rounded-bl-sm text-sm">
              <span className="animate-pulse">Searching tickets...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-slate-200 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tickets..."
            className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            data-testid="chat-input"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-3 py-2 rounded-lg transition-colors"
            data-testid="chat-send-button"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
