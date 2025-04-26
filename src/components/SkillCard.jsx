import React from 'react';
import styles from './CardStyles.module.css'; // We'll create this CSS file

const SkillCard = ({ name, para, logo, level }) => { // Use original 'logo' prop name
  // Basic level indicator (optional)
  // const levelIndicator = level ? <div className={styles.levelIndicator} style={{ width: `${level * 20}%` }}></div> : null;

  return (
    <div className={styles.skillCard}>
      {/* New wrapper div for row layout */}
      <div className={styles.cardHeaderRow}>
        {logo && <img src={logo} className={styles.cardIcon} alt={`${name} icon`} />}
        <h4 className={styles.cardTitle}>{name}</h4>
      </div>
      {para && <p className={styles.cardDescription}>{para}</p>}
      {/* {levelIndicator} You can uncomment and style this if desired */}
    </div>
  );
};

export default SkillCard; 