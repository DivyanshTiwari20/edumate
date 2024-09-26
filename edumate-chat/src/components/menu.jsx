import { useState } from 'react';

export default function Menu() {
  // State to handle the dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown on click
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none"
        >
          Tools
          <svg
            className="-mr-1 ml-2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a1 1 0 011.41-.02L10 10.5l3.36-3.31a1 1 0 111.38 1.44l-4 4a1 1 0 01-1.42 0l-4-4a1 1 0 01-.02-1.42z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <a
              href="#emotional-tool"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Emotional
            </a>
            <a
              href="#summarizer-tool"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Summarizer
            </a>
            <a
              href="#test-tool"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Test
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
