import { content } from "../Content";

const Experience = () => {
  // Use the new Experience key from Content.js
  const { Experience } = content;

  // Handle cases where data might be missing
  if (!Experience || !Experience.experience_content) {
    return null; 
  }

  return (
    <section id="experience" className="section-padding experience-section">
      <div className="experience-bg-gradient"></div>
      
      <div className="container mx-auto relative"> {/* Added relative for potential background elements */} 
        <h2 className="section-title">
          {Experience.title}
        </h2>
        <h4 className="section-subtitle">
          {Experience.subtitle}
        </h4>

        <div className="timeline-container">
          {Experience.experience_content.map((exp, i) => (
            <div key={i} className="timeline-item">
              {/* Logo Holder */}
              <div className="timeline-logo-holder">
                {exp.logo ? (
                  <img 
                    src={exp.logo} 
                    alt={`${exp.company} logo`} 
                  />
                ) : (
                  <span>?</span>
                )}
              </div>
              
              {/* Card */}
              <div className="timeline-card">
                 {/* Title and Location */}
                 <div className="title-location">
                   <h5>{exp.title}</h5>
                   <span>{exp.location}</span>
                 </div>
                 {/* Company Link */}
                 <a 
                   href={exp.website}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="company-link"
                 >
                   <span>@ {exp.company}</span>
                 </a>
                 {/* Date */}
                 <time className="date">{exp.date}</time>
                 {/* Tech Stack */}
                 <p className="tech-stack">
                   <strong>Tech:</strong> {exp.tech_stack}
                 </p>
                 {/* Description */}
                 <ul className="description-list">
                    {exp.description.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                 </ul>
              </div>
           </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience; 