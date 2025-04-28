import React, { useRef } from 'react';
import { content } from '@/config/content';
import { Helmet } from 'react-helmet-async';
import styles from './Services.module.css'; // Keep relative for module
import useGlowEffect from '@/hooks/useGlowEffect'; // Use alias path
import ServiceCard from '../ServiceCard/ServiceCard'; // Use relative path
// Import types
import { ServicesContent, ServiceItem } from '@/types/content';
import { FaReact, FaNodeJs, FaDatabase, FaMobileAlt, FaChartLine, FaTools } from 'react-icons/fa';

// Optional: Import icons if you prefer them over image paths

const Services: React.FC = () => {
  // Use imported type for content destructuring
  const servicesData = content?.services as ServicesContent; 

  // Add a check in case servicesData is undefined
  if (!servicesData) {
    console.error("Services content not found in content object.");
    return <div>Error loading services.</div>; // Or return null, or a loading state
  }

  const containerRef = useRef<HTMLDivElement>(null); // Specify element type for ref

  // Use the custom hook
  useGlowEffect(containerRef, '.glow-card'); 

  return (
    <section id="services" className={`${styles.servicesSection} section-padding`}>
      <Helmet>
        {/* SEO Tags specific to the Services section */}
        <title>Services Offered - Jadamal Mahendra Portfolio</title>
        <meta name="description" content="Offering expert web development (React, Node.js), mobile app development (React Native), and Web3/DApp solutions (Solidity). Hire Jadamal Mahendra." />
        {/* Optional: Add Open Graph tags specific to services if needed */}
        {/* <meta property="og:title" content="Services Offered by Jadamal Mahendra" /> */}
        {/* <meta property="og:description" content="Expertise in Web Dev, Mobile Dev, and Web3." /> */}
      </Helmet>

      <div className="container">
        {/* Section Title */}
        <h2 className="section-title" data-aos="fade-up">
          {servicesData.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {servicesData.subtitle}
        </h4>
        <br />

        {/* Services Grid - Apply ref here */}
        <div ref={containerRef} className={styles.servicesGrid} data-aos="fade-up">
          {/* Use ServiceItem type in map */} 
          {servicesData.service_content.map((service: ServiceItem, i: number) => (
            // Render the ServiceCard component
            <ServiceCard 
              key={i}
              title={service.title} 
              para={service.para}
              LogoComponent={service.logo} // Pass logo as LogoComponent
              // Add data-aos attributes directly to the card if needed
              data-aos="fade-up" 
              data-aos-delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 