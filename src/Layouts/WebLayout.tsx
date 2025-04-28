import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import ChatWidget from '../components/ChatWidget/ChatWidget';
import ChatErrorBoundary from '../components/ChatErrorBoundary/ChatErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const WebLayout: React.FC = () => {
  // --- Theme State --- 
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

  // --- Effect to Apply Theme --- 
  useEffect(() => {
    // Apply the data-theme attribute to the root HTML element
    document.documentElement.setAttribute('data-theme', theme);
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Rerun only when theme changes

  // --- Toggle Function --- 
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {/* Pass theme and toggle function to Navbar */}
      <Navbar currentTheme={theme} toggleTheme={toggleTheme} />
      <main>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
      <Footer />
      <ChatErrorBoundary>
        <ChatWidget />
      </ChatErrorBoundary>
      <Analytics />
      <SpeedInsights />


    </>
  );
};

export default WebLayout; 