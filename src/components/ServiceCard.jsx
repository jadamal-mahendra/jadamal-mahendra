import React from 'react';
import styles from './CardStyles.module.css';

const ServiceCard = ({ title, para, logo }) => { // Use original 'logo' prop name
  return (
    <div className={styles.serviceCard}>
       {/* Render logo using img tag */} 
       {logo && <img src={logo} className={styles.cardIcon} alt={`${title} icon`} />}
       <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{title}</h4>
        {para && <p className={styles.cardDescription}>{para}</p>}
      </div>
    </div>
  );
};

export default ServiceCard; 