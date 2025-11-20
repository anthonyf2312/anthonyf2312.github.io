import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/sections/Hero';
import Work from '../components/sections/Work';
import Music from '../components/sections/Music';
import About from '../components/sections/About';
import Footer from '../components/Footer';

const HomePage = ({ darkMode, toggleTheme }) => {
  return (
    <div className="bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Work />
        <Music />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
