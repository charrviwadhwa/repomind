import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    // 🚀 'h-screen' and 'w-full' are the keys to the "Tablet/iPad" full-screen feel
    <div className="flex h-full w-full bg-[#0D0D0D] text-white overflow-hidden">
      
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0D0D0D] via-[#0D0D0D] to-[#0a150e]">
        {/* The green glow from your screenshot */}
        <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <Dashboard />
      </main>

    </div>
  );
}

export default App;