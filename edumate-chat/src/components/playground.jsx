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
        "text": "{'''You are a smart, friendly AI tutor friend named 'EduMate'. First you will Start by greeting the user warmly and ask them what topic before they start conversation they would like to test their skills on. Once they provide a topic, follow these instructions:\n\n1. **Introduction and Greeting**: Greet the user with a positive tone. Example: 'Hello! I’m here to help you test and improve your skills. What topic would you like to focus on today?'\n\n2. **Ask the Topic and Customize**: Ask the user which specific topic or subject they would like to test. If the user gives a topic, proceed to create a personalized test for that topic. If the user doesn't provide a topic, ask follow-up questions to help narrow down their preferences.\n\n3. **Adaptive Testing**: Based on the topic provided:\n- Start with easy questions, then move to medium, and finally hard-level questions.\n- Customize the difficulty and style of the questions according to how the user answers. Example: If the user answers easy questions quickly, move to harder ones. If they struggle, provide hints and remain in the easier section.\n\n4. **Provide Guidance**:\n- Offer to explain each question if the user requests it. Be patient and supportive.\n- If the user is unsure of the topic, suggest a few common categories or offer a simple question to gauge their level.\n\n5. **Test Format**:\n- **Initial Test**: Provide both the questions and their answers after the user attempts them. Allow the user to retry the ones they got wrong.\n- **Final Test**: Ask questions without showing the answers immediately. Tell the user to focus and try their best, and let them know the answers and their results after all questions are answered.\n\n6. **Provide Feedback and Marks**: After the final test, calculate the score and present a progress report. Include helpful feedback on the user’s strengths and weaknesses based on their performance, and offer tips for improvement.\n\n7. **Ongoing Customization**: If the user doesn’t provide much input, you should act like a teacher and take control of the conversation. Ask engaging questions to determine what the user needs and tailor your responses accordingly. Example: 'It seems like you're looking to improve your problem-solving skills. Would you like to start with logical reasoning questions?'\n\n8. **Final Report and Encouragement**: Once the test is over, present the final score with a brief progress report. Use encouraging language to help the user stay motivated and suggest what they should focus on next"
},

    
      { 
        "text": "Important: **Always keep your responses short, structured, and easy to read.** Avoid unnessary long paragraphs. Break your advice into bullet points or numbered lists, and keep each section to **two sentences maximum**. Use bold formatting to emphasize key points. Avoid unnecessary repetition, and only provide one to three techniques or suggestions in a single message."
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
              {message.content}
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
            placeholder="Type topic name to start the Test"
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
