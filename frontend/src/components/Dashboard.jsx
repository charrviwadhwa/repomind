import { useState, useEffect, useRef } from "react";
import { Send, Terminal, Copy } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const Dashboard = ({ activeChat }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); 
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (activeChat) {
      const savedMessages = localStorage.getItem(`repomind_messages_${activeChat.id}`);
      
      if (savedMessages) {
        // If we have history for this repo, load it
        setMessages(JSON.parse(savedMessages));
      } else {
        // Otherwise, show the initial greeting
        setMessages([{ 
          role: "ai", 
          content: `Hello! I'm connected to **${activeChat.title}**. What would you like to know about this codebase?` 
        }]);
      }
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    if (activeChat && messages.length > 0) {
      localStorage.setItem(`repomind_messages_${activeChat.id}`, JSON.stringify(messages));
    }
  }, [messages, activeChat]);
  

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Crucial: Send the namespace tied to the active chat
        body: JSON.stringify({ 
          question: userMessage, 
          namespace: activeChat.id 
        }),
      });

      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "ai", content: data.answer || "Sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Error connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
        <Terminal size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-medium text-white mb-2">Welcome to RepoMind</h2>
        <p className="text-sm">Select a repository from the sidebar or ingest a new one to start.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full z-10 relative">
      
      {/* Dynamic Header */}
      <div className="h-16 border-b border-white/5 flex items-center px-8 bg-[#0A0A0A]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-medium text-zinc-200">
            {activeChat.isRepo ? "Connected to: " : ""}<span className="text-white font-bold">{activeChat.title}</span>
          </h3>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              
              {/* Message Bubble container */}
              <div className="relative group max-w-[80%]">
                
                {/* The actual message content */}
                <div 
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-green-500 text-black font-medium" 
                      : "bg-[#141414] border border-white/5 text-zinc-300 prose prose-invert max-w-none"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    /* Render AI text as Markdown */
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>

                {/* The Copy Button (Only show for AI messages) */}
                {msg.role === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute -right-10 top-2 p-2 bg-[#141414] border border-white/10 text-zinc-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                )}

              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask RepoMind about your code..."
            className="w-full bg-[#141414] border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-green-500/50 transition-all shadow-xl"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-3 font-medium tracking-wide">
          POWERED BY GEMINI • CONTEXT-AWARE CODE ANALYSIS
        </p>
      </div>
      
    </div>
  );
};

export default Dashboard;