// import content
import { content } from "../Content";
// Removed Marquee import
import TechIcon from 'tech-stack-icons'; // Import the component from the library

const Hero = () => {
  const { hero, resume, skills } = content;

  // Split skills for two rows
  const midpoint = Math.ceil(skills.skills_content.length / 2);
  const skillsRow1 = skills.skills_content.slice(0, midpoint);
  const skillsRow2 = skills.skills_content.slice(midpoint);

  return (
    <section id="home" className="section-padding hero-section container">
      <div className="hero-grid">
        {/* Text Content Column */}
        <div className="hero-content">
          <h3 className="hero-intro">
            Hi there, I'm
          </h3>
          <h1 className="hero-name">
            {hero.firstName} {hero.LastName}
          </h1>
          <h2 className="hero-title">
            {hero.title}
          </h2>
          <p className="hero-description">
            {resume.summary.substring(0, 150)}...
          </p>
          
          {/* Action Buttons */}
          <div className="hero-buttons">
            <a href="/resume.pdf" className="btn" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
            {/* Apply both btn and secondary style */}
            <a href="#contact" className="btn hero-button-secondary"> 
              Contact Me
            </a>
          </div>

          {/* Custom Skills Scroller */}
          <div className="skills-marquee-container">
            {/* Row 1: Scrolls Left to Right */}
            <div className="skills-row skills-row-1">
              {/* Render content only once */}
              <div className="skills-row-content">
                {skillsRow1.map((skill, i) => (
                  <div key={`1-${i}`} className="skill-item-marquee">
                    {/* Use TechIcon component, passing the string name */}
                    {skill.logo ? (
                      <TechIcon name={skill.logo} />
                    ) : (
                      <span>{skill.name}</span> // Fallback if no logo string defined
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Scrolls Right to Left */}
            <div className="skills-row skills-row-2">
              {/* Render content only once */}
              <div className="skills-row-content">
                 {skillsRow2.map((skill, i) => (
                  <div key={`2-${i}`} className="skill-item-marquee">
                    {skill.logo ? (
                      <TechIcon name={skill.logo} />
                    ) : (
                      <span>{skill.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Image Column */}
        <div className="hero-image-container">
          <img
            src={hero.image}
            alt={`${hero.firstName} ${hero.LastName} - ${hero.title}`}
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
