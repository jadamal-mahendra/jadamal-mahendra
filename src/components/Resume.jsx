import { content } from "../Content";

const Resume = () => {
  const { resume } = content;

  // Handle missing resume data
  if (!resume) {
    return null;
  }

  return (
    <section id="resume" className="section-padding resume-section">
      <h2 className="section-title">
        {resume.title}
      </h2>
      <h4 className="section-subtitle">
        {resume.subtitle}
      </h4>

      <div className="resume-card">
        <div className="resume-summary">
          <h3>{resume.summary_title}</h3>
          <p>{resume.summary}</p>
        </div>
        
        <div className="resume-skills">
          <h3>{resume.key_skills_title}</h3>
          <ul className="skills-list">
            {resume.key_skills.map((skill, i) => (
              <li key={i} className="skill-item">• {skill}</li>
            ))}
          </ul>
        </div>
        
        <div className="resume-download">
          <a
            href={resume.pdf_file}
            download="Jadamal-Mahendra-April-2025.pdf"
            className="btn"
          >
            {resume.download_text}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Resume;
