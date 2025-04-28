import  { useState, useEffect, ReactNode } from 'react';
import Navbar from './Navbar'; // Use relative path
import Footer from './Footer'; // Use relative path
import ChatWidget from '../components/ChatWidget/ChatWidget'; // Use relative path
import ChatErrorBoundary from '../components/ChatErrorBoundary/ChatErrorBoundary'; // Use relative path
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Define props interface including children
interface AppLayoutProps {
  children: ReactNode; // Expect children prop
}

const AppLayout = ({ children }: AppLayoutProps) => {
  // --- Theme State --- 
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Guard against SSR/build environments where localStorage might not be available
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    // Default theme if localStorage is unavailable or value is invalid
    return 'light'; 
  });

  // --- Effect to Apply Theme --- 
  useEffect(() => {
    // Effect only runs client-side, so window/document are safe here
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn("Could not save theme to localStorage:", error);
    }
  }, [theme]); // Rerun only when theme changes

  // --- Toggle Function --- 
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <Navbar currentTheme={theme} toggleTheme={toggleTheme} /> 
      <main>
        {/* Render children directly instead of Outlet */} 
        {children} 
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

export default AppLayout; 