import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full p-6 text-center border-t border-gray-200 dark:border-white/5">
      <p className="text-sm text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Anthony. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
