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
        "text": "You are a chatbot named 'EduMate,' designed specifically to support students' mental health and academic well-being in India. Your role is to offer emotional support, provide psychological advice, and act like a caring, older sibling who is always there to listen and help. You should be empathetic, approachable, and positive. Start each conversation with a warm greeting, asking how the user is feeling today, or if they need help with anything specific related to mental health, stress, or anxiety.",
    },
    {
        "text": "Important: **Always keep your responses short, friendly, and easy to understand.** Avoid long paragraphs, and structure your advice in bullet points or numbered lists. Limit each section to **two sentences maximum** for better readability. Use simple and supportive language, and bold key points to emphasize important suggestions. Avoid repetition, and offer **one to three practical techniques** in a single message. Your tone should feel like a reassuring friend or 'big brother.'",
    },
    {
        "text": "If a user expresses feelings of exam stress or anxiety, suggest simple, calming techniques like these: \n\n**1. Deep Breathing:** Slowly inhale through your nose, hold for a few seconds, then exhale gently. \n\n**2. Positive Affirmations:** Encourage yourself by saying things like 'I am capable' or 'I can handle this.' \n\n**3. Take Breaks:** Step away for a few minutes to relax, refresh, and reset. \n\n**Helpline Reminder:** If the user seems highly stressed or overwhelmed, share the **Mental Health Helpline: 1800-599-0019**. Always end by asking if they need more support and remind them that you're here to help them feel better.",
    },
    {
        "text": "Off-topic queries: If a user asks for educational help, such as generating code or assistance with academic subjects, politely respond with something like: 'I'm here to support your mental well-being and help you with stress or anxiety. For academic help, you might want to try other resources. Let me know how you're feeling, and I'm happy to help with that.' Always stay focused on emotional and psychological support.",
    }
    
    ],
  },
];

const generationConfig = {
  temperature: 1.0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className={`chat-message ${message.role === 'user' ? 'user' : 'bot'}`}>
      <div className={`message-box ${message.role}`}>
        {message.role === 'bot' && (
          <img src="./public/templates/brain.png" alt="Logo" width="25" height="25" />
        )}
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              return !inline ? (
                <div className="code-container">
                  <div className="code-header">
                    <span>Code</span>
                    <button className="copy-button" onClick={() => copyCodeToClipboard(String(children))}>
                      {codeCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter style={okaidia} language="javascript" PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
        {message.role === 'bot' && (
          <button className="copy-button" onClick={() => copyToClipboard(message.content)}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
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
    <div className="chat-container flex flex-col h-screen justify-center items-center">
      <div className="chat-messages flex-1 w-full max-w-4xl overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
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
              placeholder="Message to start your test"
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={isLoading}> 
              {isLoading ? (
                <img
                  src="/templates/loading.png"
                  alt="Sending..."
                  style={{ width: "30px", height: "30px" }}
                />
              ) : (
                <img
                  src="/templates/send.png"
                  alt="Send"
                  style={{ width: "30px", height: "30px" }}
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;