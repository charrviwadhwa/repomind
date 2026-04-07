import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Folder, 
  MessageSquare, 
  Plus, 
  Settings2, 
  MoreHorizontal,
  ChevronDown,
  Github,
  Link as LinkIcon,
  Trash2
} from "lucide-react";
import IngestModal from "./IngestModal";

const Sidebar = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [ingestState, setIngestState] = useState({ isOpen: false, step: 'cloning' });
  
  // State for chats to allow dynamic updates
  const [recentChats, setRecentChats] = useState([
    { title: "Plan a 3-day trip", desc: "A 3-day trip to see the northern lights...", id: 1 },
    { title: "Loyalty Program", desc: "Ideas for a customer loyalty...", id: 2 }
  ]);

  const folders = ["Work chats", "Life chats", "Projects chats"];

  const handleIngest = async () => {
    if (!repoUrl.trim() || !repoUrl.includes("github.com")) {
      return alert("Please enter a valid GitHub URL");
    }

    setIngestState({ isOpen: true, step: 'cloning' });

    try {
      const response = await fetch('http://localhost:3000/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: repoUrl }), 
        
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadyExists) {
          setIngestState({ isOpen: false });
          setActiveChat(data.namespace);
          return;
        }

        setIngestState(prev => ({ ...prev, step: 'success' }));
        const repoName = repoUrl.split('/').pop() || "New Repo";
        
        setTimeout(() => {
          const newChat = { 
            title: repoName, 
            desc: `Analysis of ${repoName}`,
            isRepo: true,
            id: data.namespace || Date.now()
          };
          setRecentChats(prev => [newChat, ...prev]);
          setActiveChat(newChat.id);
          setIngestState({ isOpen: false, step: 'cloning' });
          setRepoUrl(""); 
        }, 1500);
      }
    } catch (error) {
      console.error("Ingest Error:", error);
      setIngestState({ isOpen: false, step: 'cloning' });
    }
  };

  return (
    <aside className="w-80 h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col z-20 shadow-2xl">
      
      {/* --- 1. Header --- */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Github size={20} className="text-black" />
          </div>
          <h2 className="font-bold text-white tracking-tight">RepoMind</h2>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500">
          <Settings2 size={18} />
        </button>
      </div>

      {/* --- 2. Ingest Input --- */}
      <div className="px-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LinkIcon size={14} className="text-zinc-600 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="GitHub URL..." 
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIngest()}
            className="w-full bg-[#141414] border border-white/5 rounded-xl py-2.5 pl-9 pr-12 text-xs text-zinc-300 outline-none focus:border-green-500/50 transition-all"
          />
          <button 
            onClick={handleIngest}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-all flex items-center"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- 3. Navigation / Folders --- */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
          <span>Workspaces</span>
          <ChevronDown size={12} />
        </div>
        <div className="space-y-1">
          {folders.map((folder) => (
            <motion.div 
              key={folder}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer text-zinc-400 hover:text-zinc-100 transition-all group"
            >
              <Folder size={16} className="text-zinc-600 group-hover:text-green-500" />
              <span className="text-xs font-medium">{folder}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- 4. History (Slidable List) --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        <div className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
          History
        </div>
        
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {recentChats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveChat(chat.id)}
                className={`p-3 rounded-2xl cursor-pointer group transition-all relative border ${
                  activeChat === chat.id 
                    ? "bg-green-500/10 border-green-500/20" 
                    : "bg-[#141414]/50 border-transparent hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${chat.isRepo ? "bg-green-500/20" : "bg-zinc-800"}`}>
                      {chat.isRepo ? (
                        <Github size={12} className="text-green-400" />
                      ) : (
                        <MessageSquare size={12} className="text-zinc-400" />
                      )}
                    </div>
                    <h4 className={`text-xs font-medium truncate w-32 ${activeChat === chat.id ? "text-white" : "text-zinc-400"}`}>
                      {chat.title}
                    </h4>
                  </div>
                  {activeChat === chat.id && (
                    <motion.div layoutId="active-pill" className="w-1 h-4 bg-green-500 rounded-full" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-600 line-clamp-1 ml-9">
                  {chat.desc}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- 5. New Chat Footer --- */}
      <div className="p-6 border-t border-white/5 bg-[#0D0D0D]">
        <button className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-between hover:bg-green-400 transition-all active:scale-95 shadow-xl shadow-white/5">
          <span className="text-[11px] uppercase tracking-widest">Start Fresh</span>
          <MessageSquare size={16} />
        </button>
      </div>

      <IngestModal isOpen={ingestState.isOpen} step={ingestState.step} />
    </aside>
  );
};

export default Sidebar;