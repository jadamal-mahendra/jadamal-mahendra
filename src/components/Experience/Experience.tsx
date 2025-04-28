import React, { useEffect, useRef } from 'react';
import { content } from "../../config/content"; // Use relative path
import styles from './Experience.module.css'; // Keep relative for module
import { Helmet } from 'react-helmet-async';
import useGlowEffect from '../../hooks/useGlowEffect'; // Use relative path
import { throttle } from '../../utils/throttle'; // Use relative path
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Removed unused icons
// Import types
import { ExperienceContent, ExperienceItem } from '../../types/content';

const Experience: React.FC = () => {
  // Use imported type for content destructuring
  const { Experience: ExperienceData }: { Experience: ExperienceContent } = content;
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the timeline container
  const sectionRef = useRef<HTMLElement>(null); // Ref for the whole section element

  useGlowEffect(containerRef, '.glow-card'); 

  useEffect(() => {
    const timelineContainer = containerRef.current;
    const experienceSection = sectionRef.current;
    const timelineItems = timelineContainer?.querySelectorAll<HTMLDivElement>(`.${styles.timelineItem}`);
    const logoHolders = timelineContainer?.querySelectorAll<HTMLDivElement>(`.${styles.timelineLogoHolder}`);

    if (!timelineContainer || !experienceSection || !timelineItems || !logoHolders || timelineItems.length !== logoHolders.length) {
        console.warn("Experience scroll effect: Missing elements or mismatch.");
        return;
    }

    const handleScroll = () => {
      if (!experienceSection || !timelineContainer) return; // Guard clause

      const { top, height: sectionHeight } = experienceSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = timelineContainer.clientHeight;
      if (containerHeight <= 0) return;

      const scrollAmount = viewportHeight - top;
      const totalScrollableHeight = sectionHeight + viewportHeight;
      let progress = scrollAmount / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress)); 

      timelineContainer.style.setProperty('--scroll-progress', progress.toString());
      
      const indicatorY = progress * containerHeight;

      timelineItems.forEach((item, index) => {
        const logoHolder = logoHolders[index];
        if (!logoHolder) return;

        const logoTop = logoHolder.offsetTop; 
        const logoHeight = logoHolder.clientHeight;
        const fillAmount = indicatorY - logoTop;
        let logoFillPercent = 0;
        if (logoHeight > 0) {
            logoFillPercent = fillAmount / logoHeight;
        }
        logoFillPercent = Math.max(0, Math.min(1, logoFillPercent));
        logoHolder.style.setProperty('--logo-fill-progress', logoFillPercent.toString());
      });
    };

    const throttledScrollHandler = throttle(handleScroll, 50);
    window.addEventListener('scroll', throttledScrollHandler);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      if (logoHolders) { // Check if logoHolders exists before iterating
          logoHolders.forEach(holder => holder.style.removeProperty('--logo-fill-progress'));
      }
      if (timelineContainer) timelineContainer.style.removeProperty('--scroll-progress');
    };

  // Removed ExperienceData from dependency array unless specific data points affect the logic
  }, []); 

  if (!ExperienceData?.experience_content) {
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
      
      <div className="container mx-auto relative">
        <h2 className="section-title" data-aos="fade-up">
          {ExperienceData.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {ExperienceData.subtitle}
        </h4>

        <div ref={containerRef} className={styles.timelineContainer}>
          <div className={styles.timelineVisuals}>
            <div className={styles.timelineDropIndicator}></div>
          </div>

          {ExperienceData.experience_content.map((exp: ExperienceItem, i: number) => (
            <div 
              key={i} 
              className={styles.timelineItem}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={i * 100}
              data-aos-offset="100"
            >
              <div className={styles.timelineLogoHolder}>
                {exp.logo ? (
                  typeof exp.logo === 'string' ? (
                    <img 
                      src={exp.logo} 
                      alt={`${exp.company} logo`} 
                      className={styles.timelineLogoImage}
                    />
                  ) : (
                    // Render if it's a component type
                    React.createElement(exp.logo) 
                  )
                ) : (
                  <span className={styles.timelineLogoFallback}>?</span>
                )}
              </div>
              
              <div className={`${styles.timelineCard} glow-card`}>
                 <div className={styles.titleLocation}>
                   <h5>{exp.title}</h5>
                   {exp.location && <span>{exp.location}</span>}
                 </div>
                 <a 
                   href={exp.website}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={styles.companyLink}
                 >
                   <span>@ {exp.company}</span>
                 </a>
                 <p className={styles.date}>{exp.date}</p>
                 {exp.tech_stack && (
                   <p className={styles.techStack}>
                     <strong>Tech:</strong> {exp.tech_stack}
                   </p>
                 )}
                 <ul className={styles.descriptionList}>
                    {exp.description.map((point: string, j: number) => (
                      <li key={j}>{point}</li>
                    ))}
                 </ul>
              </div>
           </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience; 