import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './App.css';
import Chat from './components/chat';  // Correct component imports
import Summarizer from './components/summarizer';
import Playground from './components/playGround';  // Ensure correct case sensitivity
import Menu from './components/menu';

function App() {
  return (
    <Router>  {/* Wrap the app in Router */}
      <div id="root">
        {/* Title Bar */}
        <div className="title-bar">
          <h1>.EduMateChat</h1>
          <div className="tools-dropdown">
            <Menu />  {/* Tools dropdown menu for navigation */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="messages-area">
            {/* Routes for different components */}
            <Routes>
              <Route path="/" element={<Chat />} />  {/* Default route */}
              <Route path="/chat" element={<Chat />} />  {/* ChatBot route */}
              <Route path="/summarizer" element={<Summarizer />} />  {/* Summarizer route */}
              <Route path="/playground" element={<Playground />} />  {/* PlayGround route */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
