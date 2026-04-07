import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Search, 
  Bug, 
  GitBranch, 
  Mic, 
  Send, 
  Terminal,
  Zap
} from "lucide-react";
import { useChat } from "../hooks/chat";
import MessageList from "./MessageList"; 

const Dashboard = () => {
  const [input, setInput] = useState("");
  const { askQuestion, messages, loading } = useChat();

  const handleSend = () => {
    if (!input.trim() || loading) return;
    askQuestion(input);
    setInput("");
  };

  const cards = [
    { 
      icon: <Search className="text-green-400" />, 
      title: "Analyze Logic", 
      desc: "Find where specific functions are defined or explain complex logic." 
    },
    { 
      icon: <Bug className="text-green-400" />, 
      title: "Identify Bugs", 
      desc: "Scan the current repository for potential vulnerabilities or logic errors." 
    },
    { 
      icon: <Zap className="text-green-400" />, 
      title: "Refactor Code", 
      desc: "Get suggestions on how to optimize or clean up specific components." 
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center relative w-full h-full overflow-hidden bg-[#0F0F0F]">
      
      {/* 🚀 Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto custom-scrollbar pt-10">
        
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            /* --- VIEW 1: EMPTY STATE --- */
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl"
            >
              {/* Header */}
              <motion.div className="text-center mb-12">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                  <Code2 size={32} className="text-green-400" />
                </div>
                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                  Codebase Intelligence.
                </h1>
                <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
                  Ready to analyze your indexed repository. Ask me to explain files, find bugs, or suggest improvements.
                </p>
              </motion.div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12 px-4">
                {cards.map((card, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.03)" }}
                    className="bg-[#161616] border border-white/5 p-6 rounded-2xl cursor-pointer transition-all hover:border-green-500/30"
                  >
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border border-white/5">
                      {card.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-100 mb-2">{card.title}</h3>
                    <p className="text-[11px] text-zinc-500 leading-normal">{card.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[11px] text-zinc-600 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Index Ready: <span className="text-zinc-400">Gemini-1.5-Flash</span>
              </div>
            </motion.div>
          ) : (
            /* --- VIEW 2: CHAT HISTORY --- */
            <motion.div 
              key="chat-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl px-4"
            >
              <MessageList messages={messages} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- 🚀 GLASSMORPHIC BLACK INPUT BAR --- */}
      <div className="w-full max-w-3xl px-4 pb-10 pt-4 relative">
        <motion.div 
          layout
          className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
          
          <div className="w-10 h-10 bg-zinc-800/50 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
             <Terminal size={18} className="text-zinc-400" />
          </div>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={loading ? "Scanning repository..." : "Ask RepoMind about your code..."}
            disabled={loading}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-zinc-600 disabled:cursor-not-allowed"
          />

          <div className="flex items-center gap-3 pr-2 border-l border-white/5 pl-3">
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-white p-2.5 rounded-xl text-black hover:bg-green-400 transition-all disabled:opacity-20 disabled:grayscale shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </motion.div>
        
        <p className="text-center mt-4 text-[9px] text-zinc-700 uppercase tracking-[0.2em] font-medium">
          Powered by Gemini • Context-Aware Code Analysis
        </p>
      </div>

    </div>
  );
};

export default Dashboard;