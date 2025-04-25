import { content } from "../Content";
// Removed Swiper imports
import { LuGithub, LuExternalLink } from "react-icons/lu"; // Icons for links

const Projects = () => {
  const { Projects } = content;

  return (
    <section id="projects" className="section-padding bg-light_bg">
      <div className="container mx-auto">
        {/* Section Title & Subtitle */}
        <h2 className="section-title">
          {Projects.title}
        </h2>
        <h4 className="section-subtitle">
          {Projects.subtitle}
        </h4>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Projects.project_content.map((project, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover" 
                // Add a placeholder color if image fails to load
                onError={(e) => { e.target.style.backgroundColor = '#e5e7eb'; e.target.src = '' }} 
              />
              <div className="p-6 flex flex-col flex-grow">
                <h5 className="text-xl font-semibold text-dark_primary mb-2">{project.title}</h5>
                <p className="text-sm text-subtle_text leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>
                
                {/* Technology Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags?.map((tag, j) => (
                    <span 
                      key={j} 
                      className="text-xs bg-accent/10 text-accent font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="mt-auto flex items-center gap-4 pt-4 border-t border-gray-100">
                  {project.link_live && (
                    <a 
                      href={project.link_live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-accent hover:underline"
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
                      className="flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      <LuGithub size={16} />
                      View Code
                    </a>
                  )}
                   {/* Show message if no links */} 
                  {!project.link_live && !project.link_repo && (
                     <p className="text-xs text-subtle_text italic">Links not available</p>
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
