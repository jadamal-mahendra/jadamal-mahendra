import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import ChatWidget from '../components/ChatWidget';
import ChatErrorBoundary from '../components/ChatErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const Layout = () => {
  // --- Theme State --- 
  const [theme, setTheme] = useState(() => {
    // Get initial theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    // Optional: Add prefers-color-scheme check for first visit
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || 'light'; // Default to light
  });

  // --- Effect to Apply Theme --- 
  useEffect(() => {
    // Apply the data-theme attribute to the root HTML element
    document.documentElement.setAttribute('data-theme', theme);
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Rerun only when theme changes

  // --- Toggle Function --- 
  const toggleTheme = () => {
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

export default Layout; 