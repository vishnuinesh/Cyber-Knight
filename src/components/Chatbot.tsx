import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  rollNumber: string;
  onNavigateTab: (tab: 'events' | 'clubs' | 'faculty' | 'timetable' | 'sql') => void;
}

export default function Chatbot({ rollNumber, onNavigateTab }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Greetings, Initiate! ⚔️ I am the **Cyber Knight AI**, your campus grid navigator. Ask me anything about events, club contacts, faculty rooms, or fresher schedules, and I will query our databases instantly!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const originalText = messageText;
    setMessageText("");
    setLoading(true);

    try {
      // Map helper navigation tabs on client side if they ask explicitly
      const lowerText = originalText.toLowerCase();
      let triggeredNav = false;

      if (lowerText.includes("show timetable") || lowerText.includes("go to timetable") || lowerText.includes("view timetable") || lowerText.includes("my timetable")) {
        onNavigateTab("timetable");
        triggeredNav = true;
      } else if (lowerText.includes("show clubs") || lowerText.includes("go to clubs") || lowerText.includes("view clubs")) {
        onNavigateTab("clubs");
        triggeredNav = true;
      } else if (lowerText.includes("show faculty") || lowerText.includes("go to faculty") || lowerText.includes("view faculty") || lowerText.includes("who is teaching")) {
        onNavigateTab("faculty");
        triggeredNav = true;
      } else if (lowerText.includes("show event") || lowerText.includes("go to event") || lowerText.includes("register for event") || lowerText.includes("view events")) {
        onNavigateTab("events");
        triggeredNav = true;
      } else if (lowerText.includes("show sql") || lowerText.includes("go to sql") || lowerText.includes("view database") || lowerText.includes("run sql")) {
        onNavigateTab("sql");
        triggeredNav = true;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: originalText,
          rollNumber,
          history: messages.slice(-10) // pass recent context
        })
      });

      const data = await response.json();
      if (data.success) {
        let text = data.reply;
        if (triggeredNav) {
          text += "\n\n*Action executed: I have automatically re-routed your screen panel to the requested tab!*";
        }
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: "Apologies, Knight. My primary telemetry channel is facing connection latency, but all local grids are 100% active. You can navigate between events, clubs, faculty rooms, and run SQL queries using the dashboard tabs!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Simple formatter to parse linebreaks, double-asterisk bold tag, and bullet lists in chatbot replies
  const renderFormattedMessage = (text: string) => {
    return text.split("\n").map((line, lIdx) => {
      let content: React.ReactNode = line;

      // Check for bullet list item
      let isBullet = false;
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        isBullet = true;
        line = line.trim().substring(2);
      }

      // Parse bold **tags**
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      if (boldParts.length > 1) {
        content = boldParts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return <strong key={pIdx} className="text-white font-bold">{part}</strong>;
          }
          return part;
        });
      }

      if (isBullet) {
        return (
          <li key={lIdx} className="ml-4 list-disc text-gray-300 font-sans my-1 text-xs">
            {content}
          </li>
        );
      }

      return (
        <p key={lIdx} className="text-xs text-gray-300 font-sans leading-relaxed mb-2">
          {content}
        </p>
      );
    });
  };

  const recommendedPrompts = [
    { text: "What events are on today?", label: "Live Events" },
    { text: "Show my Timetable", label: "Timetable" },
    { text: "How do I register for CTF?", label: "Register for CTF" },
    { text: "List CS department Faculty", label: "CS Faculty" }
  ];

  return (
    <div id="cyber-chatbot-container" className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            id="chatbot-window"
            className="w-[360px] md:w-[400px] h-[520px] bg-cyber-slate/95 border border-cyber-blue/35 rounded-2xl flex flex-col shadow-2xl shadow-cyber-blue/20 backdrop-blur-xl overflow-hidden"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyber-neon" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyber-neon" />

            {/* Header */}
            <div className="bg-cyber-dark/80 px-4 py-3 border-b border-cyber-blue/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyber-blue/15 border border-cyber-blue/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyber-blue" />
                </div>
                <div>
                  <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">Cyber Knight AI</h3>
                  <span className="text-[9px] font-mono text-cyber-neon uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-neon animate-pulse" />
                    Interactive Grid
                  </span>
                </div>
              </div>
              <button
                id="close-chatbot"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-cyber-dark/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-cyber-blue" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-cyber-blue text-white rounded-tr-none'
                        : 'bg-cyber-slate/80 border border-cyber-blue/10 rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="font-sans leading-relaxed text-white">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderFormattedMessage(msg.text)}
                      </div>
                    )}
                    <span className="block text-[8px] font-mono text-gray-500 text-right mt-1.5 uppercase">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyber-blue animate-bounce" />
                  </div>
                  <div className="bg-cyber-slate/80 border border-cyber-blue/10 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-cyber-blue animate-spin" />
                    <span className="text-[10px] font-mono text-cyber-blue uppercase tracking-widest">Querying SQL Grid...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-cyber-blue/10 bg-cyber-dark/20">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Recommended Telemetries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {recommendedPrompts.map((prom, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setMessageText(prom.text); }}
                      className="text-[10px] font-mono px-2 py-1 bg-cyber-slate/60 hover:bg-cyber-blue/10 border border-cyber-blue/10 hover:border-cyber-blue/30 text-cyber-blue rounded-md transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {prom.label}
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={sendMessage}
              className="bg-cyber-dark/60 p-3 border-t border-cyber-blue/20 flex gap-2"
            >
              <input
                id="input-chat-message"
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ask me to show timetable, details of events..."
                className="flex-1 bg-cyber-dark/80 border border-cyber-blue/25 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue font-sans"
              />
              <button
                id="button-send-chat"
                type="submit"
                disabled={loading || !messageText.trim()}
                className="w-10 h-10 shrink-0 bg-cyber-blue hover:bg-cyan-600 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-cyber-blue/30 border border-white/10 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            layoutId="chatbot-icon"
            onClick={() => setIsOpen(true)}
            id="chatbot-trigger-btn"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-cyber-blue to-cyan-600 border border-white/10 text-white flex items-center justify-center shadow-xl shadow-cyber-blue/30 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
          >
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyber-neon border-2 border-cyber-dark rounded-full" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
