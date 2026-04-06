// test-ask.js
async function ask() {
    console.log("🔗 Connecting to RepoMind Server (Express.js Context)...");
    try {
        const res = await fetch('http://127.0.0.1:3000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 🚀 Asking a deep architectural question about Express
            body: JSON.stringify({ 
                question: "What tech stack is used here?"
            })
        });
        
        const data = await res.json();
        
        if (data.error) {
            console.error("❌ Server Error:", data.error);
        } else {
            console.log("🤖 Gemini's Architectural Analysis:");
            console.log("------------------------------------");
            console.log(data.answer);
            console.log("------------------------------------");
        }
    } catch (e) {
        console.error("💀 Connection Error:", e.message);
    }
}

ask();