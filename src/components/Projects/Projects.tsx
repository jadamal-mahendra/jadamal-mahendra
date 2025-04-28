import React from 'react';
import { content } from "@/config/content";
import { LuGithub, LuExternalLink } from "react-icons/lu";
import styles from './Projects.module.css';
import useGlowEffect from '@/hooks/useGlowEffect'; // Import the hook

const Projects: React.FC = () => {
  const { Projects: ProjectsData } = content;
  const containerRef = React.useRef<HTMLDivElement>(null); // Ref for the grid container

  // Use the glow effect hook
  useGlowEffect(containerRef, '.glow-card');

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container"> 
        <h2 className="section-title">
          {ProjectsData.title}
        </h2>
        <h4 className="section-subtitle">
          {ProjectsData.subtitle}
        </h4>

        {/* Projects Grid - Add ref */}
        <div ref={containerRef} className={styles.projectsGrid}>
          {ProjectsData.project_content.map((project, i) => (
            // Add glow-card class to the project card div
            <div
              key={i}
              className={`${styles.projectCard} glow-card`} 
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className={styles.projectImage}
                onError={(e) => {
                  const imgTarget = e.target as HTMLImageElement;
                  imgTarget.style.backgroundColor = 'var(--color-disabled-bg)';
                  imgTarget.src = ''; // Set src to empty to avoid infinite loop if fallback also fails
                }}
              />
              <div className={styles.projectContent}>
                <h5 className={styles.projectTitle}>{project.title}</h5>
                <p className={styles.projectDescription}>
                  {project.description}
                </p>
                
                <div className={styles.tagsContainer}>
                  {project.tags?.map((tag, j) => (
                    <span 
                      key={j} 
                      className={styles.projectTag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.linksContainer}>
                  {project.link_live && (
                    <a 
                      href={project.link_live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      <LuExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {project.link_repo && (
                    <a 
                      href={project.link_repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      <LuGithub size={16} />
                      View Code
                    </a>
                  )}
                   {/* Show message if no links */} 
                  {!project.link_live && !project.link_repo && (
                     <p className={styles.noLinksText}>Links not available</p>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
