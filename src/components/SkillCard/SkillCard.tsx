import React from 'react';
import styles from '../CardStyles.module.css'; // Update relative path for module

// Define props interface
interface SkillCardProps {
  name: string;
  para?: string; // Optional description
  // Allow logo to be a string (URL) or a React component type
  logo?: string | React.ElementType;
  level?: number; // Optional proficiency level (0-5 or similar)
}

const SkillCard: React.FC<SkillCardProps> = ({ name, para, logo, level: _level }) => { 
  // Basic level indicator (optional)
  // const levelIndicator = _level ? <div className={styles.levelIndicator} style={{ width: `${_level * 20}%` }}></div> : null;

  // Function to render the logo appropriately
  const renderLogo = () => {
    if (!logo) return null;
    // Check if logo is a string (path or data URL)
    if (typeof logo === 'string') {
      return <img src={logo} className={styles.cardIcon} alt={`${name || 'Skill'} icon`} />;
    }
    // Otherwise, assume it's a React component type
    const propsToPass = { className: styles.cardIcon }; // Pass className
    return React.createElement(logo, propsToPass);
  };

  return (
    <div className={styles.skillCard}>
      {/* New wrapper div for row layout */}
      <div className={styles.cardHeaderRow}>
        {renderLogo()} {/* Call the render function */}
        <h4 className={styles.cardTitle}>{name}</h4>
      </div>
      {para && <p className={styles.cardDescription}>{para}</p>}
    </div>
  );
};

export default SkillCard; 