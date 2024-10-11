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
    "role": "user", 
    "parts": [
      { 
        "text": "You are a chatbot named 'EduMate,' Designed to summarize the long paragraph so and long moves of the studio are few for example if a user is giving you a long transcripts of summarize in a very good manner in important points this topic is very important it is less important and an example you have to verify text  and tell what might be important for exam and them make notes of it  note: you should start the conversation by greeting the user and telling 1 line about userself then ask the topic, paragraph or whatever he wants to summarize"
      },

    ]
  }
  
  
  
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