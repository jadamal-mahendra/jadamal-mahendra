import React from 'react';
import { content } from "../Content";
import { Parallax } from 'react-scroll-parallax';
import styles from './Experience.module.css'; // Import CSS Module

const Experience = () => {
  // Use the new Experience key from Content.js
  const { Experience } = content;

  // Handle cases where data might be missing
  if (!Experience || !Experience.experience_content) {
    return null; 
  }

  return (
    <section 
      id="experience" 
      className={`${styles.experienceSection} section-padding`}
      data-aos="fade-up"
    >
      <Parallax speed={-10}>
        <div className="experience-bg-gradient"></div>
      </Parallax>
      
      <div className="container mx-auto relative"> {/* Added relative for potential background elements */} 
        <h2 className="section-title" data-aos="fade-up">
          {Experience.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {Experience.subtitle}
        </h4>

        <div className={styles.timelineContainer}>
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
              <div className={styles.timelineCard}>
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
        </div>
      </div>
    </section>
  );
};

export default Experience; 