import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    // 'flex h-full w-full' ensures the sidebar stays left and content fills the rest
    <div className="flex h-full w-full bg-background overflow-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* The Green Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full animate-glow" />
        
        <Dashboard />
      </main>
      
    </div>
  );
}

export default App;