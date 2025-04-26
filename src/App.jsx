// import components
import Hero from "./components/Hero";
import Navbar from "./Layouts/Navbar";
import Services from "./components/Services";
import Experience from "./components/Experience";
import Awards from "./components/Awards";
import Contact from "./components/Contact";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ParallaxProvider } from 'react-scroll-parallax';
import { Helmet, HelmetProvider } from 'react-helmet-async';


// Import custom CSS (assuming it's needed globally or we use modules later)
import "./index.css"; 

const App = () => {
  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // values from 0 to 3000, with step 50ms
      offset: 120, // offset (in px) from the original trigger point
      once: true, // whether animation should happen only once - while scrolling down
      delay: 100, // values from 0 to 3000, with step 50ms
      easing: 'ease-out-cubic', // default easing for AOS animations
    });
  }, []);

  return (
    <HelmetProvider>
      <ParallaxProvider>
        <Helmet>
          <title>Jadamal Mahendra - Web Developer Portfolio</title>
          <meta name="description" content="Results-driven Lead Software Developer with 4+ years' leadership in building scalable web & mobile applications. Explore Jadamal Mahendra's portfolio & projects." />
          <meta name="keywords" content="Jadamal Mahendra, web developer, portfolio, React, JavaScript, Node.js, frontend, backend, fullstack, lead developer, scalable applications" />
          <meta property="og:title" content="Jadamal Mahendra - Web Developer Portfolio" />
          <meta property="og:description" content="Results-driven Lead Software Developer with 4+ years' leadership in building scalable web & mobile applications. Explore Jadamal Mahendra's portfolio & projects." />
          <meta property="og:type" content="website" />
        </Helmet>
        <div className="overflow-hidden">
          <Navbar />
          <Hero />
          <Services />
          <Experience />
          <Awards />
          <Contact />
          <footer className="app-footer">
            <p className="app-footer-text">
              &copy; {new Date().getFullYear()} Jadamal Mahendra. All rights reserved.
            </p>
          </footer>
        </div>
      </ParallaxProvider>
    </HelmetProvider>
  );
};

export default App;
