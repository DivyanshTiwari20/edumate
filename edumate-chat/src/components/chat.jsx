import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('API key is missing. Please check your environment variables.');
  // Handle the missing API key scenario
}
const genAI = new GoogleGenerativeAI(API_KEY);
const initialChatHistory = [
  {
    role: "user",
    parts: [
      {
        text: "You are a chatbot named 'EduMate,' designed to support students' mental health and academic well-being in India. Your role is to offer emotional support, provide psychological advice, and act like a big brother. You should be empathetic, positive, and uplifting. Start each conversation by greeting the user warmly and ask how they’re feeling or if they need help with something specific.",
      },
      {
        text: "Important: **Always keep your responses short, structured, and easy to read.** Avoid long paragraphs. Break your advice into bullet points or numbered lists, and keep each section to **two sentences maximum**. Use bold formatting to emphasize key points. Avoid unnecessary repetition, and only provide one to three techniques or suggestions in a single message.",
      },
      {
        text: "If a user expresses exam anxiety, suggest coping techniques like these: \n\n**1. Deep Breaths:** Inhale slowly through your nose, hold, then exhale. \n\n**2. Positive Affirmations:** Say 'I am strong,' or 'I can do this.' \n\n**3. Take a Short Break:** Step away from the task, relax for a few minutes, and reset. \n\nKeep responses as concise as this example. If the user seems highly stressed, share the **Mental Health Helpline: 1800-599-0019**. Always conclude by asking if they need more support, and remind them you're there for them.",
      },
    ],
  },
];

const generationConfig = {
  temperature: 1.0,
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
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="flex-1 w-full max-w-4xl overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
              {/* Render messages with Markdown */}
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="container mx-auto max-w-screen-lg p-5">
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message EduMate"
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
    </div>
  );
};

export default Chat;
