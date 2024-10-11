import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

function Menu() {
  return (
    <nav className="menu">
      <ul className="flex space-x-4">
        {/* Navigation Links */}
        <li>
          <Link to="/chat" className="text-white-700 hover:text-blue-600"><b>ChatBot</b></Link>
        </li>
        <li>
          <Link to="/summarizer" className="text-white-700 hover:text-blue-600"><b>Summarizer</b></Link>
        </li>
        <li>
          <Link to="/playground" className="text-white-700 hover:text-blue-600 mr-7"><b>PlayGround</b></Link>
        </li>
      </ul>
    </nav>
  );
}

export default Menu;
