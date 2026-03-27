// test-ask.js
async function ask() {
    console.log("🔗 Connecting to server at http://127.0.0.1:3000...");
    try {
        const res = await fetch('http://127.0.0.1:3000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: "How is the #octocat ID styled in the CSS?" })
        });
        
        const data = await res.json();
        console.log("🤖 Gemini says:", data.answer);
    } catch (e) {
        console.error("💀 Error:", e.message);
    }
}
ask();