import { 
  Search, 
  Folder, 
  MessageSquare, 
  Plus, 
  Settings2, 
  MoreHorizontal,
  ChevronDown
} from "lucide-react";

const Sidebar = () => {
  const folders = ["Work chats", "Life chats", "Projects chats", "Clients chats"];
  const recentChats = [
    { title: "Plan a 3-day trip", desc: "A 3-day trip to see the northern lights..." },
    { title: "Ideas for a customer loyalty program", desc: "Here are seven ideas for a customer..." },
    { title: "Help me pick", desc: "Here are some gift ideas for your fishing-loving..." }
  ];

  return (
    <aside className="w-80 h-screen bg-[#171717] border-r border-white/5 flex flex-col p-4 z-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
            <MessageSquare size={18} className="text-zinc-400" />
          </div>
          <h2 className="font-semibold text-zinc-200">My Chats</h2>
        </div>
        <Settings2 size={18} className="text-zinc-500 cursor-pointer hover:text-zinc-300" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full bg-[#212121] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 focus:ring-1 focus:ring-green-500/50 outline-none placeholder:text-zinc-600"
        />
      </div>

      {/* Folders Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Folders</span>
          <div className="flex gap-2">
            <Plus size={14} className="text-zinc-500 cursor-pointer" />
            <ChevronDown size={14} className="text-zinc-500 cursor-pointer" />
          </div>
        </div>
        <div className="space-y-1">
          {folders.map((folder) => (
            <div key={folder} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/50 cursor-pointer group">
              <div className="flex items-center gap-3">
                <Folder size={18} className="text-zinc-500 group-hover:text-green-500 transition-colors" />
                <span className="text-sm text-zinc-400">{folder}</span>
              </div>
              <MoreHorizontal size={14} className="text-zinc-600 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Recent Chats</span>
          <ChevronDown size={14} className="text-zinc-500" />
        </div>
        <div className="space-y-2">
          {recentChats.map((chat) => (
            <div key={chat.title} className="p-3 rounded-xl bg-zinc-800/30 border border-transparent hover:border-white/5 cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-zinc-300 truncate w-40">{chat.title}</h4>
                <MoreHorizontal size={14} className="text-zinc-600" />
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-1">{chat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New Chat Button */}
      <button className="mt-4 w-full bg-[#4ADE80] hover:bg-[#3ecb73] text-black font-bold py-3.5 px-4 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-green-500/10">
        <span className="text-sm">New chat</span>
        <div className="bg-white/20 p-1 rounded-md">
          <Plus size={16} />
        </div>
      </button>

    </aside>
  );
};

export default Sidebar;