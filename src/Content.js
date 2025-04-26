// import illustrations
import web_developer_illustration from "./assets/images/illustrations/web_developer.svg";

// Import SVG Icons (Removed ?react suffix)
import ReactLogo from './assets/icons/reactjs.svg';
import NodeLogo from './assets/icons/nodejs.svg';
import GraphqlLogo from './assets/icons/graphql.svg';
import MaterialUILogo from './assets/icons/materialui.svg';
import TypeScriptLogo from './assets/icons/typescript.svg';
import NextjsLogo from './assets/icons/nextjs.svg';
import SolidityLogo from './assets/icons/solidity.svg';
import MongoDbLogo from './assets/icons/mongodb.svg';
import WebpackLogo from './assets/icons/webpack.svg';
import GitLogo from './assets/icons/git.svg';
import SwiftLogo from './assets/icons/swift.svg'; // Added for services

// Resume PDF path (from public directory)
const resume_pdf = "/assets/Jadamal-Mahendra.pdf";

// Career start date - used to calculate years of experience
// Updated start date based on resume experience (May 2021)
const careerStartDate = new Date('2021-05-01'); 

// Calculate years of experience
const calculateYearsOfExperience = () => {
  const now = new Date();
  let years = now.getFullYear() - careerStartDate.getFullYear();

  // Adjust if we haven't reached the anniversary month/day yet
  if (
    now.getMonth() < careerStartDate.getMonth() ||
    (now.getMonth() === careerStartDate.getMonth() &&
     now.getDate() < careerStartDate.getDate())
  ) {
    years--;
  }

  return years;
};

// import icons from react-icons
import { GrMail } from "react-icons/gr";
import { MdArrowForward, MdCall } from "react-icons/md";

import { FaLinkedin } from "react-icons/fa";

// Import company logos (adjust filenames/extensions if needed)
import elliotLogo from "./assets/images/Projects/Elliot-system-logo_Final_CTC-1.webp"; 
import viralnationLogo from "./assets/images/Projects/VN_Logo_White.svg";
import oodlesLogo from "./assets/images/Projects/Oodles-Technologies-2.svg";

// Import paths for skills with official logos (assuming they exist)
// import typescriptLogo from "./assets/images/Skills/typescript.svg"; // Assume this file exists
// import nextjsLogo from "./assets/images/Skills/nextjs.svg"; // Assume this file exists

export const content = {
  nav:  [
    {
      link: "#home",
    },
    {
      link: "#services",
    },
    { // Add this block
      link: "#experience", 
    },
    {
      link: "#contact",
    },
  ],
  hero: {
    title: "Lead software developer",
    firstName: "Jadamal",
    LastName: "Mahendra",
    btnText: "Hire Me",
    image: "/assets/illustrations/hero-1.svg",
    careerStartYear: careerStartDate.getFullYear(),
    hero_content: [
      {
        count: `${calculateYearsOfExperience()}+`,
        text: "Years of Experience in Web Development",
      },
      {
        count: "15+",
        text: "Projects Worked in my career",
      },
    ],
  },
  skills: {
    title: "Skills",
    subtitle: "MY TOP SKILLS",
    skills_content: [
      {
        name: "React js",
        para: "Expert in building interactive UIs and SPAs using React.js, including state management with Redux.",
        logo: ReactLogo,
        level: 5,
      },
    
      {
        name: "Node js",
        para: "Proficient in server-side development with Node.js, creating scalable backend systems.",
        logo: NodeLogo,
        level: 4,
      },
      {
        name: "GraphQL",
        para: "Skilled in designing and implementing GraphQL APIs with tools like Prisma for efficient data handling.",
        logo: GraphqlLogo,
        level: 4,
      },
      {
        name: "Material UI",
        para: "Experienced in designing responsive and visually appealing UI components using Material UI.",
        logo: MaterialUILogo,
        level: 4,
      },
      {
        name: "TypeScript",
        para: "Leveraging TypeScript for type safety and enhanced developer productivity in complex projects.",
        logo: TypeScriptLogo,
        level: 4,
      },
      {
        name: "Next Js",
        para: "Building server-rendered React applications and static websites with Next.js.",
        logo: NextjsLogo,
        level: 4,
      },
      {
        name: "Web3 / Blockchain",
        para: "Developing decentralized applications (dApps) and NFT marketplaces using Solidity, Web3.js, and Hardhat.",
        logo: SolidityLogo,
        level: 3,
      },
      {
        name: "Databases",
        para: "Experience with both SQL (e.g., PostgreSQL) and NoSQL (e.g., MongoDB) databases.",
        logo: MongoDbLogo,
        level: 4,
      },
      {
        name: "Microfrontends",
        para: "Implemented Microfrontend architecture for modular and scalable UI development.",
        logo: WebpackLogo,
        level: 4,
      },
        {
        name: "Git",
        para: "Proficient with Git version control for managing code history, branching, merging, and collaborating effectively in team environments.",
        logo: GitLogo,
        level: 4,
      },
     
    ],
    icon: MdArrowForward,
  },
  // Uncomment services section
  services: {
    title: "Services",
    subtitle: "WHAT I OFFER",
    service_content: [
      {
        title: "Frontend Development",
        para: "Building scalable, high-performance UIs with React, Next.js, TypeScript, and Microfrontend architectures. Expertise in state management (Redux) and UI libraries (MUI, Fluent UI).",
        logo: ReactLogo,
      },
      {
        title: "Backend & API Development",
        para: "Developing robust backend systems and APIs using Node.js, Express, and GraphQL. Experienced with Prisma, SQL, and NoSQL databases for efficient data handling.",
        logo: NodeLogo,
      },
      {
        title: "Mobile App Development",
        para: "Creating cross-platform mobile applications with React Native, integrating native features and ensuring seamless user experiences across iOS and Android.",
        logo: SwiftLogo,
      },
      {
        title: "Web3 & Blockchain Solutions",
        para: "Designing and implementing decentralized applications (dApps), smart contracts (Solidity), and NFT marketplaces using Web3.js and related technologies.",
        logo: SolidityLogo,
      },
    ],
  },

  // Removed Hireme section
  /*
  Hireme: {
    title: "Hire Me",
    subtitle: "FOR YOUR PROJECTS",
    image1: hire_me_illustration,
    image2: hire_me_illustration,
    para: `As an experienced web developer with over ${calculateYearsOfExperience()} years of hands-on experience, I offer expertise in building dynamic and responsive websites and applications tailored to your specific needs. Whether you're looking to create a stunning portfolio website, a robust e-commerce platform, or a cutting-edge web application, I have the skills and dedication to bring your vision to life. Let's collaborate on your next project and turn your ideas into reality.`,
    btnText: "Hire Me",
  },
  */

  Contact: {
    title: "Contact Me",
    subtitle: "GET IN TOUCH",
    social_media: [
      {
        text: "jadamalmahendra@gmail.com",
        icon: GrMail,
        link: "mailto:jadamalmahendra@gmail.com",
      },
      {
        text: "07303037961",
        icon: MdCall,
        link: "tel:+917303037961",
      },
      {
        text: "linkedin.com/in/jadamalmahendra",
        icon: FaLinkedin,
        link: "https://linkedin.com/in/jadamalmahendra",
      },
    ],
  },
  resume: {
    title: "My Resume",
    subtitle: "MY PROFESSIONAL JOURNEY",
    pdf_file: "/assets/Jadamal-Mahendra-April-2025.pdf",
    image: web_developer_illustration,
    summary_title: "Professional Summary",
    summary: `Results-driven Lead Software Developer with nearly 4+ years of hands-on leadership experience, specializing in building scalable web and mobile applications using modern JavaScript frameworks. Skilled in React.js, GraphQL, Node.js, and Web3 technologies, with deep expertise in real-time systems, NFT marketplaces, and AI-powered features. Proven track record in full-cycle product development, cross-functional team collaboration, and delivering high-impact digital solutions across startups and enterprise environments.`,
    key_skills_title: "Key Skills",
    key_skills: [
      "React.js / React Native / Next.js",
      "Node.js / Express",
      "TypeScript / JavaScript",
      "GraphQL / REST APIs",
      "Prisma / SQL / MongoDB",
      "Solidity / Web3.js / Hardhat",
      "Material UI /Fluent  UI",
      "Microfrontend Architecture",
      "State Management (Redux)",
      "Testing (Jest)",
      "Git / CI/CD",
    ],
    download_text: "Download Resume",
  },
  Experience: {
    title: "Work Experience",
    subtitle: "MY PROFESSIONAL JOURNEY",
    experience_content: [
      {
        company: "Elliot Systems",
        website: "https://www.elliotsystems.com/",
        logo: elliotLogo,
        title: "Senior Software Engineer",
        date: "May 2024 – Present",
        location: "Pune, India",
        tech_stack: "React.js, TypeScript, Redux, Microfrontend Architecture, Jest, Git, REST APIs, NPM packages",
        description: [
          "Developed and maintained scalable, high-performance UIs for a Transportation Management System using React.js and Redux.",
          "Implemented Microfrontend architecture, enabling modular code, future scalability, and reduced deployment complexity.",
          "Leveraged TypeScript to improve code quality, ensure type safety, and enhance developer productivity.",
          "Wrote and maintained unit tests achieving 95% coverage, ensuring application stability.",
          "Collaborated with cross-functional teams (product, engineering, design) to deliver user-centric features.",
          "Reduced API response times by 30% through frontend optimizations and backend service integration.",
          "Spearheaded new feature integrations contributing to a 20% increase in user engagement.",
        ]
      },
      {
        company: "ViralNation (Contract)",
        website: "https://www.viralnation.com/",
        logo: viralnationLogo,
        title: "Lead Frontend Developer",
        date: "Apr 2023 – May 2024",
        location: "Remote/Pune",
        tech_stack: "React JS, React Native, Next JS, Node JS, GraphQL, Solidity, Web3.js, Prisma, MUI, TypeScript, OpenAI API, Imagly",
        description: [
          "Led a distributed team developing an advanced influencer marketing platform with real-time communication and blockchain integration.",
          "Built a unified messaging system (emails, in-app chats, WhatsApp).",
          "Developed a real-time chat system using GraphQL Subscriptions.",
          "Created a complex analytics dashboard visualizing cross-platform metrics (Instagram, YouTube, TikTok).",
          "Designed and implemented a secure NFT marketplace using Solidity and Web3.js.",
          "Built responsive, high-performance UIs with React JS, MUI, TypeScript achieving 100% design fidelity.",
          "Developed React Native features integrating libraries like Imagly for media-rich mobile experiences.",
          "Integrated OpenAI API for AI-driven content generation and automation.",
          "Utilized GraphQL + Prisma for efficient, type-safe data access.",
          "Led code reviews, mentored peers, and contributed to rapid innovation cycles.",
        ]
      },
      {
        company: "Oodles technologies pvt ltd",
        website: "https://www.oodlestechnologies.com/",
        logo: oodlesLogo,
        title: "Lead Software Developer",
        date: "May 2021 – Mar 2023",
        location: "Remote/Gurugram",
        tech_stack: "React JS, React Native, TypeScript, Redux, Redux-Saga, WebSockets",
        description: [
          "Led 10+ end-to-end web & mobile projects with cross-functional teams.",
          "Designed scalable frontend architecture; improved API response times by 30%+ and reduced app load time to <1s.",
          "Built real-time features using WebSockets for instant communication.",
          "Integrated 20+ REST APIs for travel, booking, and messaging systems.",
          "Collaborated with UI/UX to deliver pixel-perfect, responsive interfaces.",
          "Mentored junior developers, boosting team efficiency by 40%.",
          "Ensured high performance and cross-platform consistency.",
        ]
      }
    ]
  },
  Footer: {
    text: `All © Copy Right Reserved ${new Date().getFullYear()}`,
  },
  Projects: {
    title: "Projects",
    subtitle: "MY CREATIONS",
    project_content: [
      {
        title: "Influencer Marketing Platform",
        image: "https://www.viralnation.com/hs-fs/hubfs/ViralNation_January2025/images/VN-Web-Tablet.gif",
        description: "Advanced platform connecting influencers and brands, featuring real-time chat (GraphQL Subscriptions), unified messaging, cross-platform analytics, and an NFT marketplace.",
        tags: ["React", "Next.js", "Node.js", "GraphQL", "Prisma", "Solidity", "Web3.js", "TypeScript", "MUI"],
        link_live: null,
        link_repo: null,
      },
      {
        title: "Transportation Management System UI",
        image: "path/to/your/tms-ui-image.jpg",
        description: "Scalable, high-performance user interfaces for managing logistics workflows, built using a Microfrontend architecture.",
        tags: ["React", "TypeScript", "Redux", "Microfrontends", "Jest"],
        link_live: null,
        link_repo: null,
      },
      {
        title: "Tripsalam Hybrid App",
        image: "path/to/your/tripsalam-image.jpg",
        description: "Hybrid mobile application for travel planning and booking, integrating multiple REST APIs.",
        tags: ["React Native", "React", "Redux-Saga", "REST APIs"],
        link_live: null,
        link_repo: null,
      },
      {
        title: "DHTML Real-time Call Handling",
        image: "path/to/your/dhtml-image.jpg",
        description: "Real-time call handling application featuring interactive interfaces and seamless communication using WebSockets.",
        tags: ["React", "WebSockets", "CSS"],
        link_live: null,
        link_repo: null,
      },
    ],
  },
  Awards: {
    title: "Awards & Recognition",
    subtitle: "ACKNOWLEDGEMENTS",
    awards_content: [
      {
        name: "Rising Star Award",
        organization: "Oodles Technologies Pvt Ltd",
        date: "01 May 2022",
        description: "Awarded in recognition of significant contributions, rapid progression from associate to lead developer within a year, and successful leadership on key projects like Tripsalam, DHTML, and HeyKaido.",
        // Optional: Add an icon or image path if desired
        // icon: LuAward // Example using Lucide icon 
      },
      // Add more awards if needed
    ]
  },
};
