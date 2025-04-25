import { content } from "../Content";
// Removed Swiper imports
import { LuAward } from "react-icons/lu"; // Example icon

const Awards = () => {
  // Ensure this matches the key in Content.js
  const { Awards } = content; 

  // Handle case where Awards data might be missing
  if (!Awards || !Awards.awards_content) {
    return null; // Or render a placeholder/message
  }

  return (
    <section id="awards" className="section-padding awards-section">
      <div className="container mx-auto">
        {/* Section Title & Subtitle */}
        <h2 className="section-title">
          {Awards.title}
        </h2>
        <h4 className="section-subtitle">
          {Awards.subtitle}
        </h4>

        {/* Awards List/Grid - Simple list for now */}
        <div className="awards-list">
          {Awards.awards_content.map((award, i) => (
            <div key={i} className="award-card">
              {/* Icon */}
              <div className="award-icon">
                <LuAward size={28} /> 
              </div>
              {/* Award Details */}
              <div className="award-details">
                <h5>{award.name}</h5>
                <p className="organization-date">
                  {award.organization} - {award.date}
                </p>
                <p className="description">
                  {award.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards; 