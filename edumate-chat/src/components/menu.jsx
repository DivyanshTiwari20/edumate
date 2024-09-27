import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

function Menu() {
  return (
    <nav className="menu">
      <ul className="flex space-x-4">
        {/* Navigation Links */}
        <li>
          <Link to="/chat" className="text-gray-700 hover:text-blue-600">ChatBot</Link>
        </li>
        <li>
          <Link to="/summarizer" className="text-gray-700 hover:text-blue-600">Summarizer</Link>
        </li>
        <li>
          <Link to="/playground" className="text-gray-700 hover:text-blue-600">PlayGround</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
