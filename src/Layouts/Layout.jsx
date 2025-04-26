import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import ChatWidget from '../components/ChatWidget';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
};

export default Layout; 