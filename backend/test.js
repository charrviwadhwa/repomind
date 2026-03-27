// test-ingest.js


const testRepo = "https://github.com/octocat/Spoon-Knife"; // You can use any public repo

async function runTest() {
    console.log(`🚀 Testing RepoMind ingestion for: ${testRepo}`);
    
    try {
        const response = await fetch('http://127.0.0.1:3000/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoUrl: testRepo })
        });

        const data = await response.json();
        console.log("✅ Server Response:", data);
    } catch (error) {
        console.error("❌ Test Failed. Is your server running on port 5000?", error.message);
    }
}

runTest();