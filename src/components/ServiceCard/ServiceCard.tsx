import React from 'react';
import styles from '../Services/Services.module.css'; // Import styles from parent Services component

// Define props interface
interface ServiceCardProps {
  title: string;
  para?: string; // Optional description
  // LogoComponent can be a string (URL) or a React component type
  LogoComponent?: string | React.ElementType;
  // Include data-aos attributes as optional props
  ["data-aos"]?: string;
  ["data-aos-delay"]?: number | string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  para, 
  LogoComponent, 
  ...aosProps // Capture remaining props like data-aos
}) => {
  
  // Function to render the logo appropriately
  const renderLogo = () => {
    if (!LogoComponent) return null;

    // Check if LogoComponent is a string (path or data URL)
    if (typeof LogoComponent === 'string') {
      return <img src={LogoComponent} className={styles.serviceIcon} alt={`${title || 'Service'} icon`} />;
    }

    // Otherwise, assume it's a React component type
    // Pass className explicitly if it's a component
    const propsToPass = { className: styles.serviceIcon };
    return React.createElement(LogoComponent, propsToPass);
  };

  return (
    // Apply glow-card effect from index.css along with serviceCard styles
    <div className={`glow-card ${styles.serviceCard}`} {...aosProps}> 
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