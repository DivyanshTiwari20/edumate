import React from 'react'
import Chat from './components/chat'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">EduMate Chat</h1>
      </header>
      <main className="container mx-auto p-4">
        <Chat />
      </main>
    </div>
  )
}

export default App