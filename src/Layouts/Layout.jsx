import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Child routes will render here */}
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default Layout; 