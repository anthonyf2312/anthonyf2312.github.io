import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ darkMode, toggleTheme }) => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 backdrop-blur-md bg-gray-100/70 dark:bg-[#121212]/70 border-b border-transparent dark:border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
          ANTHONY<span className="text-indigo-500">.</span>
        </div>
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-300">
            <li><a href="#work" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Work</a></li>
            <li><a href="#music" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Music</a></li>
            <li><a href="#about" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">About</a></li>
          </ul>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
