import React, { useEffect, useRef } from 'react';
import { content } from "../Content";
// Removed Swiper imports
import { LuAward } from "react-icons/lu"; // Example icon
import styles from './Awards.module.css'; // Import CSS Module
import { Helmet } from 'react-helmet-async'; // Import Helmet

const Awards = () => {
  // Ensure this matches the key in Content.js
  const { Awards } = content; 
  const containerRef = useRef(null); // Add ref for the container

  // Add useEffect for mouse tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(`.${styles.awardItem}`);

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
    console.log("Award item mouse move listener attached.");

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      console.log("Award item mouse move listener removed.");
      cards.forEach(card => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    };
  }, []); // Empty dependency array

  // Handle case where Awards data might be missing
  if (!Awards || !Awards.awards_content) {
    return null; // Or render a placeholder/message
  }

  return (
    <section 
      id="awards" 
      className={`${styles.awardsSection} section-padding`}
      data-aos="fade-up" // Add AOS attribute
    >
      <Helmet>
        <title>Awards & Recognition - Jadamal Mahendra</title>
        <meta name="description" content="View the awards and recognitions received by Jadamal Mahendra, including the Rising Star Award from Oodles Technologies." />
      </Helmet>
      <div className="container mx-auto">
        {/* Section Title & Subtitle */}
        <h2 className="section-title" data-aos="fade-up">
          {Awards.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {Awards.subtitle}
        </h4>

        {/* Attach ref to the awards grid */}
        <div ref={containerRef} className={styles.awardsGrid} data-aos="fade-up" data-aos-delay="100">
          {Awards.awards_content.map((award, i) => (
            <div key={i} className={styles.awardItem}>
              {/* Icon */}
              <div className={styles.awardIcon}>
                <LuAward size={28} /> 
              </div>
              {/* Award Details */}
              <div className={styles.awardDetails}>
                <h5 className={styles.awardName}>{award.name}</h5>
                <div className={styles.awardOrgDate}>
                  <span className={styles.awardOrg}>{award.organization}</span>
                  <span className={styles.awardDate}>{award.date}</span>
                </div>
                <p className={styles.awardDescription}>{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards; 