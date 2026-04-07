async function ask() {
  console.log("Connecting to RepoMind server (Express.js context)...");
  try {
    const res = await fetch("http://127.0.0.1:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: "What is this app about?",
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.error("Server Error:", data.error);
    } else {
      console.log("Gemini architectural analysis:");
      console.log("------------------------------------");
      console.log(data.answer);
      console.log("------------------------------------");
    }
  } catch (e) {
    console.error("Connection Error:", e.message);
  }
}

ask();
