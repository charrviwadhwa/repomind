import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🚀 THE FIX: Accept 'namespace' as a second argument
  const askQuestion = async (question, namespace = "") => {
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Add User Message to UI
    const userMessage = { role: 'user', text: question }; // Changed 'content' to 'text' to match your MessageList
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🚀 THE FIX: Send the namespace to the backend
        body: JSON.stringify({ 
          question, 
          namespace 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch answer.');
      }
      
      const aiMessage = { 
        role: 'ai', 
        text: data?.answer || 'No answer generated.' 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: `⚠️ Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, askQuestion, loading };
};