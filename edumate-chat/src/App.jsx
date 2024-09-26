import React from 'react';
import './App.css';
import Chat from './components/chat';
import Menu from './components/menu';

function App() {
  return (
    <div id="root">
      <div className="title-bar">
        <h1>EduMate Chat</h1>
        <Menu />
      </div>
      <div className="main-content">
        <Chat />
      </div>
    </div>
  );
}

export default App;