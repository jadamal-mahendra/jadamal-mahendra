import React, { useEffect, useRef } from 'react';
import { content } from '../Content';
import { Helmet } from 'react-helmet-async';
// import TechIcon from 'tech-stack-icons'; // Removed import
import styles from './Services.module.css'; // Import CSS Module

// Optional: Import icons if you prefer them over image paths
// import { FaCode, FaMobileAlt, FaCube } from 'react-icons/fa'; 

const Services = () => {
  const { services } = content;
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(`.${styles.serviceItem}`);

    const handleMouseMove = (e) => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    console.log("Service item mouse move listener attached.");

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      console.log("Service item mouse move listener removed.");
      cards.forEach(card => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    };
  }, []);

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
          {services.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {services.subtitle}
        </h4>
        <br />

        {/* Services Grid */}
        <div ref={containerRef} className={styles.servicesGrid} data-aos="fade-up">
          {services.service_content.map((service, i) => (
            <div key={i} className={styles.serviceItem} data-aos="fade-up" data-aos-delay={i * 100}>
              {/* Use logo component from content */}
              <div className={styles.serviceIcon}>
                {service.logo ? (
                  // <service.logo className={styles.serviceSvgIcon} /> // Render imported SVG component
                  <img src={service.logo} className={styles.serviceSvgIcon} alt={service.title || 'Service icon'} /> // Use img tag
                ) : (
                  <span>Icon</span> // Optional fallback
                )}
              </div>
              
              {/* Option 2: Icon Component (Uncomment imports and mapping above) */}
              {/* <div className="service-icon">{serviceIcons[i]}</div> */}
              
              <h5 className={styles.serviceTitle}>{service.title}</h5>
              <p className={styles.serviceDescription}>{service.para}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 