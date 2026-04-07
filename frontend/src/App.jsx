import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  // 1. Load History from LocalStorage (or use default if empty)
  const [recentChats, setRecentChats] = useState(() => {
    const savedChats = localStorage.getItem("repomind_chats");
    if (savedChats) return JSON.parse(savedChats);
    
    return [
      { title: "Plan a 3-day trip", desc: "A 3-day trip to see the northern lights...", id: "trip-1" },
      { title: "Loyalty Program", desc: "Ideas for a customer loyalty...", id: "loyalty-1" }
    ];
  });

  // 2. Load Active Chat from LocalStorage
  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem("repomind_active_chat") || null;
  });

  // 3. Save to LocalStorage whenever recentChats changes
  useEffect(() => {
    localStorage.setItem("repomind_chats", JSON.stringify(recentChats));
  }, [recentChats]);

  // 4. Save to LocalStorage whenever activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("repomind_active_chat", activeChatId);
    } else {
      localStorage.removeItem("repomind_active_chat"); // Clear it if we "Start Fresh"
    }
  }, [activeChatId]);

  const activeChat = recentChats.find(chat => chat.id === activeChatId);

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] text-white overflow-hidden">
      <Sidebar 
        activeChatId={activeChatId} 
        setActiveChatId={setActiveChatId}
        recentChats={recentChats}
        setRecentChats={setRecentChats}
      />
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0A0A0A]">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
        <Dashboard activeChat={activeChat} />
      </main>
    </div>
  );
}

export default App;