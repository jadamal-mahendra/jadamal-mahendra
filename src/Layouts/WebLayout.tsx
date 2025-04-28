import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar'; // Comment out
// import Footer from './Footer'; // Comment out
// import ChatWidget from '../components/ChatWidget/ChatWidget'; // Comment out
// import ChatErrorBoundary from '../components/ChatErrorBoundary/ChatErrorBoundary'; // Comment out
// import { Analytics } from '@vercel/analytics/react'; // Comment out
// import { SpeedInsights } from '@vercel/speed-insights/react'; // Comment out

const WebLayout: React.FC = () => {
  // --- Comment out Theme State --- 
  /*
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Get initial theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    // Validate savedTheme before returning
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Fallback to light if invalid or not set
    return 'light';
  });
  */

  // --- Comment out Effect to Apply Theme --- 
  /*
  useEffect(() => {
    // Apply the data-theme attribute to the root HTML element
    // Ensure document exists (it should in useEffect, but good practice)
    if (typeof document !== 'undefined') { 
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);
  */

  // --- Comment out Toggle Function --- 
  /*
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  */

  return (
    <>
      {/* Pass theme and toggle function to Navbar */}
      {/* <Navbar currentTheme={theme} toggleTheme={toggleTheme} /> */}
      <main>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
      {/* <Footer /> */}
      {/* Comment out ChatWidget and ErrorBoundary usage */}
      {/* <ChatErrorBoundary>
        <ChatWidget />
      </ChatErrorBoundary> */}
      {/* <Analytics /> */}
      {/* <SpeedInsights /> */}
    </>
  );
};

export default WebLayout; 