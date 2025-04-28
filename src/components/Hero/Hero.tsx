import React from 'react';
import { content } from "@/config/content"; // Use alias path
import styles from './Hero.module.css'; // Keep relative path for CSS module
import { Helmet } from 'react-helmet-async'; 
// Import specific types from the new declaration file
import { HeroContent, SkillsContent, Skill } from '@/types/content';

const Hero: React.FC = () => {
  // content is now typed, destructure with imported types
  const { hero, skills }: { hero: HeroContent, skills: SkillsContent } = content;

  // Split skills for two rows
  const midpoint = Math.ceil(skills.skills_content.length / 2);
  const skillsRow1: Skill[] = skills.skills_content.slice(0, midpoint);
  const skillsRow2: Skill[] = skills.skills_content.slice(midpoint);

  return (
    <section id="home" className={`${styles.heroSection} section-padding`}>
      <Helmet>
        <title>Jadamal Mahendra - Web Developer Portfolio</title>
        <meta name="description" content="Results-driven Lead Software Developer with 4+ years' leadership in building scalable web & mobile applications. Explore Jadamal Mahendra's portfolio & projects." />
      </Helmet>
      <div className={`${styles.heroGrid} container`}>
        {/* Text Content Column */}
        <div className={styles.heroContent}>
          <h3 className={styles.heroIntro} data-aos="fade-down">
            Hi there, I'm
          </h3>
          <h1 className={styles.heroName} data-aos="fade-down">
            {hero.firstName} {hero.LastName}
          </h1>
          <h2 className={styles.heroTitle} data-aos="fade-down" data-aos-delay="100">
            {hero.title}
          </h2>
          <div className="md:w-5/6" data-aos="fade-down" data-aos-delay="200">
            <br />
            <p className={styles.heroDescription}>
              Results-driven Lead Software Developer with 4+ years' leadership in building scalable web & mobile applications. Explore Jadamal Mahendra's portfolio & projects.
            </p>
            <br />
            {/* Action Buttons */}
            <div className={styles.heroButtons}>
              <a href="/Jadamal-Mahendra-April-2025.pdf" className="btn" target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
              <a href="#contact" className={`${styles.heroButtonSecondary} btn`}> 
                Contact Me
              </a>
            </div>
          </div> 

          {/* Custom Skills Scroller */}
          <div className={styles.skillsMarqueeContainer} data-aos="fade-up" data-aos-delay="300">
            {/* Row 1: Scrolls Left to Right */}
            <div className={`${styles.skillsRow} ${styles.skillsRow1}`}>
              <div className={styles.skillsRowContent}>
                {/* Added duplicate for seamless loop */} 
                {[...skillsRow1].map((skill: Skill, i) => (
                  <div key={`1-${i}`} className={styles.skillItemMarquee}>
                    {skill.logo && typeof skill.logo === 'string' ? (
                      <img src={skill.logo} className={styles.skillIcon} alt={skill.name || 'Skill icon'} />
                    ) : (
                      <span>{skill.name}</span> 
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolls Right to Left */}
            <div className={`${styles.skillsRow} ${styles.skillsRow2}`}>
              <div className={styles.skillsRowContent}>
                {/* Added duplicate for seamless loop */} 
                 {[...skillsRow2].map((skill: Skill, i) => (
                  <div key={`2-${i}`} className={styles.skillItemMarquee}>
                    {skill.logo && typeof skill.logo === 'string' ? (
                      <img src={skill.logo} className={styles.skillIcon} alt={skill.name || 'Skill icon'} />
                    ) : (
                      <span>{skill.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image Column */}
        <div className={styles.heroImageContainer}>
          <img
            src={hero.image}
            alt={`${hero.firstName} ${hero.LastName} - ${hero.title}`}
            className={styles.heroImage}
            data-aos="fade-left"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
