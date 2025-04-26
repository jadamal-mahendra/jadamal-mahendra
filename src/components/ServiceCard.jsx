import React from 'react';
// import styles from './CardStyles.module.css'; // Old import
import styles from './Services.module.css'; // Correct import

const ServiceCard = ({ title, para, LogoComponent }) => { // Prop might be a string or component
  
  // Function to render the logo appropriately
  const renderLogo = () => {
    if (!LogoComponent) return null;

    // Check if LogoComponent is a string (path or data URL)
    if (typeof LogoComponent === 'string') {
      return <img src={LogoComponent} className={styles.serviceIcon} alt={`${title || 'Service'} icon`} />;
    }

    // Otherwise, assume it's a React component type
    return <LogoComponent className={styles.serviceIcon} />;
  };

  return (
    // Apply glow-card effect from index.css along with serviceCard styles
    <div className={`glow-card ${styles.serviceCard}`}> 
      {/* Add the icon container */} 
      <div className={styles.serviceIconContainer}>
        {renderLogo()} {/* Call the render function */}
      </div>
      {/* Content doesn't need a separate container based on Services.module.css */} 
      <h4 className={styles.serviceTitle}>{title}</h4> 
      {para && <p className={styles.serviceDescription}>{para}</p>} 
    </div>
  );
};

export default ServiceCard; 