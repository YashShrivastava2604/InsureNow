import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import axios from "axios";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // NEW: State to track which image is currently in the drawer
  const [activeImage, setActiveImage] = useState(null);
  
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setActiveImage(null);

    const currentInput = input;
    setInput("");

    const userMsg = { role: "user", text: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post("/ai/chat", { // http://127.0.0.1:8000/chat
        query: currentInput,
        session_id: sessionId || undefined,
      });

      const { session_id, response } = res.data;
      setSessionId(session_id);

      setMessages((prev) => [
        ...prev,
        { role: "ai", data: response },
      ]);

      // Auto-open the drawer if the new response contains an image
      if (response?.content?.image) {
        setActiveImage(response.content.image);
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          data: { type: "text", content: { text: "Something went wrong. Try again." } },
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center transition-all duration-300 ease-out transform origin-center ${
          open ? "scale-50 opacity-0 pointer-events-none" : "scale-100 opacity-100 hover:scale-110"
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Main Container for both Chat and Drawer */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-end transition-all duration-300 ease-out transform origin-bottom-right ${
          open ? "scale-100 opacity-100 pointer-events-auto translate-y-0" : "scale-90 opacity-0 pointer-events-none translate-y-8"
        }`}
      >
        
        {/* THE SMART DRAWER (Slides left on Desktop, Covers on Mobile) */}
        <div
          className={`absolute z-10 top-0 left-0 w-full h-full md:left-auto md:right-full md:mr-4 md:w-[550px] md:h-full bg-[rgb(var(--card)/0.50)] backdrop-blur-md rounded-2xl border border-[rgb(var(--border))] shadow-2xl flex flex-col transition-all duration-500 ease-out ${
            activeImage && open
              ? "opacity-100 md:translate-x-0 pointer-events-auto"
              : "opacity-0 md:translate-x-8 pointer-events-none"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgb(var(--border)/0.5)] bg-[rgb(var(--bg)/0.5)] rounded-t-2xl">
            <span className="font-semibold text-sm">Visual Context</span>
            <button
              onClick={() => setActiveImage(null)}
              className="p-1.5 rounded-full hover:bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Drawer Image Content */}
          <div className="flex-1 p-4 flex items-center justify-center bg-white/5 dark:bg-black/20 overflow-hidden rounded-b-2xl">
            {activeImage && (
              <img
                src={activeImage}
                alt="Expanded AI Visual"
                className="w-full h-auto max-h-full rounded-lg shadow-md object-contain animate-in fade-in zoom-in-95 duration-300"
              />
            )}
          </div>
        </div>

        {/* THE MAIN CHAT PANEL */}
        <div className="relative z-20 w-[90vw] md:w-[50vw] max-w-[800px] h-[80vh] max-h-[700px] bg-[rgb(var(--card)/0.65)] backdrop-blur-xl rounded-2xl border border-[rgb(var(--border))] shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--border)/0.5)] bg-[rgb(var(--bg)/0.3)]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[rgb(var(--card))] bg-green-500"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">AI Insurance Advisor</h3>
                <p className="text-xs text-[rgb(var(--muted-foreground))]">Always online</p>
              </div>
            </div>
            <button 
              onClick={() => { setOpen(false); setActiveImage(null); }}
              className="p-2 rounded-full hover:bg-[rgb(var(--muted))] text-[rgb(var(--muted-foreground))] transition-colors"
            >
              <X className="w-5 h-5 transition-transform hover:rotate-90 duration-200" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 chat-scroll">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-3">
                <Bot className="w-12 h-12 text-[rgb(var(--muted-foreground))]" />
                <p className="text-sm">Hi! I can help you find plans, explain <br/> policies, or answer insurance questions.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-3 shrink-0 border border-blue-200 dark:border-blue-800">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}

                <div className={`max-w-[85%] flex flex-col gap-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md shadow-blue-500/20"
                    : "bg-[rgb(var(--muted))] border border-[rgb(var(--border))] text-[rgb(var(--text))] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
                }`}>
                  {msg.role === "user" ? (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  ) : (
                    /* Pass the setActiveImage function down to ChatMessage */
                    <ChatMessage data={msg.data} onImageClick={setActiveImage} />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-3 shrink-0 border border-blue-200 dark:border-blue-800">
                  <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--muted-foreground))] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--muted-foreground))] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--muted-foreground))] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-[rgb(var(--bg)/0.5)] border-t border-[rgb(var(--border)/0.5)]">
            <div className="relative flex items-center shadow-sm rounded-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all duration-200">
              <input
                className="flex-1 pl-5 pr-12 py-3.5 bg-transparent border-none text-sm focus:outline-none placeholder:text-[rgb(var(--muted-foreground))]"
                placeholder="Ask anything about insurance..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className={`absolute right-1.5 p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                  input.trim() && !loading
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-105"
                    : "bg-transparent text-[rgb(var(--muted-foreground))] cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}