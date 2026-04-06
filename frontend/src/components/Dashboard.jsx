import { BookMarked, Monitor, Languages, Mic, Send } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
      
      {/* 1. Header Section */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-500/20">
          <div className="w-6 h-6 border-2 border-green-500 rounded-full border-t-transparent animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">How can I help you today?</h1>
        <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
          This code will display a prompt asking the user for their name, and then it will display a greeting message.
        </p>
      </div>

      {/* 2. Feature Cards */}
      <div className="grid grid-cols-3 gap-4 max-w-3xl w-full mb-10">
        {[
          { icon: <BookMarked className="text-green-500" />, title: "Saved Prompt Templates", desc: "Users save and reuse prompt templates for faster responses." },
          { icon: <Monitor className="text-green-500" />, title: "Media Type Selection", desc: "Users select media type for tailored interactions." },
          { icon: <Languages className="text-green-500" />, title: "Multilingual Support", desc: "Choose language for better interaction." }
        ].map((card, i) => (
          <div key={i} className="bg-[#1e1e1e] border border-white/5 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all cursor-pointer group">
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-2">{card.title}</h3>
            <p className="text-[11px] text-zinc-500 leading-normal">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. Category Selectors */}
      <div className="flex gap-6 text-[13px] text-zinc-500 mb-8">
        {["All", "Text", "Image", "Video", "Music", "Analytics"].map((cat) => (
          <span key={cat} className={`cursor-pointer hover:text-white transition-colors ${cat === 'All' ? 'text-green-500 border-b border-green-500 pb-1' : ''}`}>
            {cat}
          </span>
        ))}
      </div>

      {/* 4. Smart Input Bar */}
      <div className="max-w-3xl w-full relative group">
        <div className="bg-white rounded-2xl p-2 flex items-center gap-3 shadow-2xl shadow-black">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-black rounded-full" />
          </div>
          <input 
            type="text" 
            placeholder="Type your prompt here..." 
            className="flex-1 bg-transparent border-none outline-none text-black text-sm placeholder:text-zinc-400"
          />
          <div className="flex items-center gap-3 pr-2">
            <Mic size={20} className="text-zinc-400 cursor-pointer hover:text-black transition-colors" />
            <button className="bg-green-500 p-2 rounded-xl text-white hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Footer disclaimer */}
      <p className="absolute bottom-6 text-[10px] text-zinc-600">
        ChatGPT can make mistakes. Consider checking important information.
      </p>

    </div>
  );
};

export default Dashboard;