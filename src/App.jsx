import React from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import HomePage from './pages/HomePage';

const App = () => {
  const [darkMode, toggleTheme] = useDarkMode();

  return (
    <div className="min-h-screen">
      <HomePage darkMode={darkMode} toggleTheme={toggleTheme} />
    </div>
  );
};

export default App;
