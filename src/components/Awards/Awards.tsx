import React, { useRef } from 'react';
import { content } from "@/config/content";
import { LuAward } from "react-icons/lu";
import styles from './Awards.module.css';
import { Helmet } from 'react-helmet-async';
import useGlowEffect from '@/hooks/useGlowEffect';
// Import types
import { AwardsContent, AwardItem } from '@/types/content';

const Awards: React.FC = () => {
  // Use imported type for content destructuring
  const { Awards: AwardsData }: { Awards: AwardsContent } = content;
  const containerRef = useRef<HTMLDivElement>(null);

  useGlowEffect(containerRef, '.glow-card');

  if (!AwardsData?.awards_content) {
    return null;
  }

  return (
    <section 
      id="awards" 
      className={`${styles.awardsSection} section-padding`}
      data-aos="fade-up"
    >
      <Helmet>
        <title>Awards & Recognition - Jadamal Mahendra</title>
        <meta name="description" content="View the awards and recognitions received by Jadamal Mahendra, including the Rising Star Award from Oodles Technologies." />
      </Helmet>
      <div className="container mx-auto">
        <h2 className="section-title" data-aos="fade-up">
          {AwardsData.title}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {AwardsData.subtitle}
        </h4>

        <div ref={containerRef} className={styles.awardsGrid} data-aos="fade-up" data-aos-delay="100">
          {AwardsData.awards_content.map((award: AwardItem, i: number) => (
            <div key={i} className={`${styles.awardItem}  glow-card`}>
              <div className={styles.awardIcon}>
                <LuAward size={28} /> 
              </div>
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