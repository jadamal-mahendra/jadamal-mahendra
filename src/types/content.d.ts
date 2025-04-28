import React from 'react';

// Basic Skill type
export interface Skill {
  name: string;
  para?: string;
  logo?: string | React.ElementType; 
  level?: number;
}

// Navigation Item
export interface NavItem {
  link: string;
  text?: string;
}

// Hero Content
export interface HeroContent {
  title: string;
  firstName: string;
  LastName: string;
  btnText: string;
  image: string;
  careerStartYear: number;
  hero_content: Array<{ count: string; text: string }>;
}

// Skills Section
export interface SkillsContent {
  title: string;
  subtitle: string;
  skills_content: Skill[];
  icon: React.ElementType; 
}

// Service Item
export interface ServiceItem {
  title: string;
  para: string;
  logo: string | React.ElementType;
}

// Services Section
export interface ServicesContent {
  title: string;
  subtitle: string;
  service_content: ServiceItem[];
}

// Experience Item
export interface ExperienceItem {
  company: string;
  website?: string;
  logo?: string | React.ElementType;
  title: string;
  date: string;
  location?: string;
  tech_stack?: string;
  description: string[];
}

// Experience Section
export interface ExperienceContent {
  title: string;
  subtitle: string;
  experience_content: ExperienceItem[];
}

// Social Media Item
export interface SocialMediaItem {
  text: string;
  icon: React.ElementType;
  link: string;
}

// Contact Section
export interface ContactContent {
  title: string;
  subtitle: string;
  social_media: SocialMediaItem[];
}

// Resume Section 
export interface ResumeContent {
    title: string;
    subtitle: string;
    pdf_file: string;
    image: string;
    summary_title: string;
    summary: string;
    key_skills_title: string;
    key_skills: string[];
    download_text: string;
}

// Project Item
export interface ProjectItem {
    title: string;
    image: string; 
    description: string;
    tags: string[];
    link_live?: string | null;
    link_repo?: string | null;
}

// Projects Section
export interface ProjectsContent {
    title: string;
    subtitle: string;
    project_content: ProjectItem[];
}

// Award Item
export interface AwardItem {
  name: string;
  organization: string;
  date: string;
  description: string;
}

// Awards Section
export interface AwardsContent {
    title: string;
    subtitle: string;
    awards_content: AwardItem[];
}

// Footer Section
export interface FooterContent {
    text: string;
}


// Main Content Structure
export interface Content {
  nav: NavItem[];
  hero: HeroContent;
  skills: SkillsContent;
  services: ServicesContent;
  Experience: ExperienceContent; 
  Contact: ContactContent;      
  resume: ResumeContent;
  Projects: ProjectsContent;     
  Awards: AwardsContent;         
  Footer: FooterContent;         
} 