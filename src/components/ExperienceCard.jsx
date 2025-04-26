import React from 'react';
import styles from './CardStyles.module.css';

const ExperienceCard = ({ company, title, dates, description, logo }) => {
  return (
    <div className={styles.experienceCard}>
      {logo && <img src={logo} alt={`${company} logo`} className={styles.companyLogo} />}
      <div className={styles.cardContent}>
         <h4 className={styles.cardTitle}>{title}</h4>
         <p className={styles.companyName}>{company}</p>
         {dates && <p className={styles.cardDates}>{dates}</p>} 
         {description && <p className={styles.cardDescription}>{description}</p>}
      </div>
    </div>
  );
};

export default ExperienceCard; 