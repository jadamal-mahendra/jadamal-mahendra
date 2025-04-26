import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import ChatWidget from '../components/ChatWidget';
import ChatErrorBoundary from '../components/ChatErrorBoundary';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
      <Footer />
      <ChatErrorBoundary>
        <ChatWidget />
      </ChatErrorBoundary>
    </>
  );
};

export default Layout; 