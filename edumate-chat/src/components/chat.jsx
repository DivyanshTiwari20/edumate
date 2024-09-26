import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('API key is missing. Please check your environment variables.');
  // Handle the missing API key scenario
}
const genAI = new GoogleGenerativeAI(API_KEY);
const initialChatHistory = [
  { role: "user", parts: [{ text: "Act as an app named \"EduMate\". You are an educational web application helping students with their mental health and emotional support, especially regarding study and exam anxiety. Provide emotional support, tell jokes, and act as a big brother. If they seem to be experiencing severe mental health issues, suggest they call 1800-599-0019. Greet them at the start and thank them at the end of each chat. Your primary role is to provide emotional support and a friendly vibe." }] },
  { role: "model", parts: [{ text: "Understood. I'll act as EduMate, providing friendly support and encouragement to students. How can I help you today?" }] },
];

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const initializedChat = model.startChat({
      history: initialChatHistory,
      generationConfig,
    });
    setChat(initializedChat);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const result = await chat.sendMessage(input);
        const botMessage = { role: 'bot', content: result.response.text() };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
        if (error.message.includes('API key not valid')) {
          errorMessage = "There's an issue with the API key. Please contact support.";
        }
        setMessages(prev => [...prev, { role: 'bot', content: errorMessage }]);
      }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;