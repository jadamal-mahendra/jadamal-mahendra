import React from 'react';
import styles from '../CardStyles.module.css';

// Define props interface
interface ExperienceCardProps {
  company: string;
  title: string;
  dates?: string; // Optional dates
  // Description can be string or array of strings from data
  description?: string | string[];
  // Allow logo to be a string (URL) or a React component type
  logo?: string | React.ElementType;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ 
  company, 
  title, 
  dates, 
  description, 
  logo 
}) => {
  // Handle description: join if it's an array
  const renderedDescription = Array.isArray(description)
    ? description.join(' \n\n ') // Join paragraphs with double newline
    : description;

  // Function to render the logo appropriately
  const renderLogo = () => {
    if (!logo) return null;
    // Check if logo is a string (path or data URL)
    if (typeof logo === 'string') {
      return <img src={logo} alt={`${company} logo`} className={styles.companyLogo} />;
    }
    // Otherwise, assume it's a React component type
    const propsToPass = { className: styles.companyLogo }; // Pass className
    return React.createElement(logo, propsToPass);
  };

  return (
    <div className={styles.experienceCard}>
      {renderLogo()} {/* Call the render function */}
      <div className={styles.cardContent}>
         <h4 className={styles.cardTitle}>{title}</h4>
         <p className={styles.companyName}>{company}</p>
         {dates && <p className={styles.cardDates}>{dates}</p>} 
         {/* Render the processed description */}
         {renderedDescription && <p className={styles.cardDescription}>{renderedDescription}</p>}
      </div>
    </div>
  );
};

export default ExperienceCard; 