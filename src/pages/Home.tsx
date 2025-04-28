import React from 'react';
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services/Services";
import Experience from "@/components/Experience/Experience";
import Awards from "@/components/Awards/Awards";
import Contact from "@/components/Contact/Contact";
// Removed AOS import as it's likely initialized in App.jsx or main.jsx
// import AOS from "aos";
// import "aos/dist/aos.css";

const Home: React.FC = () => {
  // AOS initialization is usually done once at the top level (App.jsx)
  // If not, uncomment the useEffect below
  /*
  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 120,
      once: true,
      delay: 100,
      easing: 'ease-out-cubic',
    });
  }, []);
  */

  return (
    // Removed ParallaxProvider wrapper as it's likely wrapping App in main.jsx
    <>
      {/* Removed Helmet - Handled per-route or globally */}
      {/* Removed Navbar - Handled by Layout */}
      {/* Section 1: Hero - Default Background */}
      <div style={{ backgroundColor: 'var(--color-background)' }}>
        <Hero />
      </div>

      {/* Section 2: Services - Alternate Background */}
      <div style={{ backgroundColor: 'var(--color-background-alt)' }}>
        <Services />
      </div>

      {/* Section 3: Experience - Default Background */}
      <div style={{ backgroundColor: 'var(--color-background)' }}>
        <Experience />
      </div>

      {/* Section 4: Awards - Alternate Background */}
      <div style={{ backgroundColor: 'var(--color-background-alt)' }}>
        <Awards />
      </div>

      {/* Section 5: Contact - Default Background */}
      <div style={{ backgroundColor: 'var(--color-background)' }}>
        <Contact />
      </div>
      {/* Removed Footer - Handled by Layout */}
    </>
  );
};

export default Home; 