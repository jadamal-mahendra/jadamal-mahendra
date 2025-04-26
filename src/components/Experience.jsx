import React, { useEffect, useRef } from 'react';
import { content } from "../Content";
// import { Parallax } from 'react-scroll-parallax'; // Commented out
import styles from './Experience.module.css'; // Import CSS Module
import { Helmet } from 'react-helmet-async'; // Import Helmet
import useGlowEffect from '../hooks/useGlowEffect'; // Import the hook
import { throttle } from '../utils/throttle'; // Import throttle utility

const Experience = () => {
  // Use the new Experience key from Content.js
  const { Experience } = content;
  const containerRef = useRef(null); // Add ref for the container
  const sectionRef = useRef(null); // Ref for the whole section element

  // Use the custom hook
  useGlowEffect(containerRef, `.${styles.timelineCard}`);

  // --- Scroll Progress Effect Hook ---
  useEffect(() => {
    const timelineContainer = containerRef.current;
    const experienceSection = sectionRef.current;
    // Query items here ONCE
    const timelineItems = timelineContainer?.querySelectorAll(`.${styles.timelineItem}`);
    const logoHolders = timelineContainer?.querySelectorAll(`.${styles.timelineLogoHolder}`);

    if (!timelineContainer || !experienceSection || !timelineItems || !logoHolders || timelineItems.length !== logoHolders.length) {
        console.warn("Experience scroll effect: Missing elements or mismatch.");
        return; // Exit if elements aren't ready or counts mismatch
    }

    const handleScroll = () => {
      const { top, height: sectionHeight } = experienceSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = timelineContainer.clientHeight;

      if (containerHeight <= 0) return;

      const scrollAmount = viewportHeight - top;
      const totalScrollableHeight = sectionHeight + viewportHeight;
      let progress = scrollAmount / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress)); 

      // Update the main progress line variable
      timelineContainer.style.setProperty('--scroll-progress', progress);
      
      // Calculate indicator's Y position within the timeline container
      const indicatorY = progress * containerHeight;

      // Calculate fill for each logo holder
      timelineItems.forEach((item, index) => {
        const logoHolder = logoHolders[index];
        if (!logoHolder) return;

        const logoTop = logoHolder.offsetTop; // Top of logo relative to container
        const logoHeight = logoHolder.clientHeight; // Height of logo

        // How far indicator is past the logo's top edge
        const fillAmount = indicatorY - logoTop;

        // Percentage fill (0 to 1) for this logo
        let logoFillPercent = 0;
        if (logoHeight > 0) {
            logoFillPercent = fillAmount / logoHeight;
        }

        // Clamp between 0 and 1
        logoFillPercent = Math.max(0, Math.min(1, logoFillPercent));

        // Set the variable
        logoHolder.style.setProperty('--logo-fill-progress', logoFillPercent);
      });
    };

    const throttledScrollHandler = throttle(handleScroll, 50);
    window.addEventListener('scroll', throttledScrollHandler);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      // Clean up custom property on unmount
      logoHolders.forEach(holder => holder.style.removeProperty('--logo-fill-progress'));
      if (timelineContainer) timelineContainer.style.removeProperty('--scroll-progress');
    };

  }, []);

  // Handle cases where data might be missing
  if (!Experience || !Experience.experience_content) {
    return null; 
  }

  return (
    <section 
      ref={sectionRef} 
      id="experience" 
      className={`${styles.experienceSection} section-padding`}
      data-aos="fade-up"
    >
      <Helmet>
        <title>Work Experience - Jadamal Mahendra</title>
        <meta name="description" content="Explore Jadamal Mahendra's professional journey as a Lead Software Developer, including roles at Elliot Systems, ViralNation, and Oodles Technologies." />
      </Helmet>
      {/* <Parallax speed={-10}>
        <div className="experience-bg-gradient"></div>
      </Parallax> */}
      
      <div className="container mx-auto relative"> {/* Added relative for potential background elements */} 
        <h2 className="section-title" data-aos="fade-up">
          {Experience.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {Experience.subtitle}
        </h4>

        {/* Attach ref to the timeline container */}
        <div ref={containerRef} className={styles.timelineContainer}>

          {/* Container for the visual elements (lines, drop) */}
          <div className={styles.timelineVisuals}>
            {/* Drop indicator element moved inside visuals container */}
            <div className={styles.timelineDropIndicator}></div>
          </div>

          {/* Map the experience items - these are siblings to timelineVisuals */}
          {Experience.experience_content.map((exp, i) => (
            <div 
              key={i} 
              className={styles.timelineItem}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={i * 100}
              data-aos-offset="100"
            >
              {/* Logo Holder */}
              <div className={styles.timelineLogoHolder}>
                {exp.logo ? (
                  <img 
                    src={exp.logo} 
                    alt={`${exp.company} logo`} 
                  />
                ) : (
                  <span>?</span>
                )}
              </div>
              
              {/* Card */}
              <div className={`${styles.timelineCard} glow-card`}>
                 {/* Title and Location */}
                 <div className={styles.titleLocation}>
                   <h5>{exp.title}</h5>
                   {exp.location && <span>{exp.location}</span>}
                 </div>
                 {/* Company Link */}
                 <a 
                   href={exp.website}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={styles.companyLink}
                 >
                   <span>@ {exp.company}</span>
                 </a>
                 {/* Date */}
                 <p className={styles.date}>{exp.date}</p>
                 {/* Tech Stack */}
                 {exp.tech_stack && (
                   <p className={styles.techStack}>
                     <strong>Tech:</strong> {exp.tech_stack}
                   </p>
                 )}
                 {/* Description */}
                 <ul className={styles.descriptionList}>
                    {exp.description.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                 </ul>
              </div>
           </div>
          ))}
          
          {/* Drop indicator moved inside .timelineVisuals */}
          {/* <div className={styles.timelineDropIndicator}></div> */}
        </div>
      </div>
    </section>
  );
};

export default Experience; 