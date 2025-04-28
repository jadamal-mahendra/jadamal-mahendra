import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Uncomment
import Footer from './Footer'; // Uncomment
import ChatWidget from '../components/ChatWidget/ChatWidget'; // Uncomment
import ChatErrorBoundary from '../components/ChatErrorBoundary/ChatErrorBoundary'; // Uncomment
import { Analytics } from '@vercel/analytics/react'; // Uncomment
import { SpeedInsights } from '@vercel/speed-insights/react'; // Uncomment

const WebLayout: React.FC = () => {
  // --- Restore Theme State --- 
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

  // --- Restore Effect to Apply Theme --- 
  useEffect(() => {
    // Apply the data-theme attribute to the root HTML element
    // Ensure document exists (it should in useEffect, but good practice)
    if (typeof document !== 'undefined') { 
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // --- Restore Toggle Function --- 
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {/* Restore Navbar */}
      <Navbar currentTheme={theme} toggleTheme={toggleTheme} />
      <main>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
      {/* Restore Footer */}
      <Footer />
      {/* Restore ChatWidget and ErrorBoundary */}
      <ChatErrorBoundary>
        <ChatWidget />
      </ChatErrorBoundary>
      {/* Restore Analytics */}
      <Analytics />
      {/* Restore SpeedInsights */}
      <SpeedInsights />
    </>
  );
};

export default WebLayout; 