// import images
import Hero_person from "./assets/images/Hero/person.png";

import figma from "./assets/images/Skills/figma.png";
import sketch from "./assets/images/Skills/sketch.png";
import ps from "./assets/images/Skills/ps.png";
import reactjs from "./assets/images/Skills/react.png";
import nodejs from "./assets/images/Skills/node.png";
import python from "./assets/images/Skills/python.png";
import graphql from "./assets/images/Skills/GraphQL.png";
import mui from "./assets/images/Skills/mui.png";

import services_logo1 from "./assets/images/Services/logo1.png";
import services_logo2 from "./assets/images/Services/mobileDev.png";
import services_logo3 from "./assets/images/Services/web3.png";

import project1 from "./assets/images/Projects/img1.png";
import project2 from "./assets/images/Projects/img2.png";
import project3 from "./assets/images/Projects/img3.png";
import person_project from "./assets/images/Projects/person.png";

import avatar1 from "./assets/images/Testimonials/avatar1.png";
import avatar2 from "./assets/images/Testimonials/avatar2.png";
import avatar3 from "./assets/images/Testimonials/avatar3.png";
import avatar4 from "./assets/images/Testimonials/avatar4.png";

import Hireme_person from "./assets/images/Hireme/person.png";
import Hireme_person2 from "./assets/images/Hireme/person2.png";

// import icons from react-icons
import { GrMail } from "react-icons/gr";
import { MdArrowForward, MdCall } from "react-icons/md";
import { BsInstagram } from "react-icons/bs";
import { TbSmartHome } from "react-icons/tb";
import { BiUser } from "react-icons/bi";
import { RiServiceLine, RiProjectorLine } from "react-icons/ri";
import { MdOutlinePermContactCalendar } from "react-icons/md";

export const content = {
  nav: [
    {
      link: "#home",
      icon: TbSmartHome,
    },
    {
      link: "#skills",
      icon: BiUser,
    },
    {
      link: "#services",
      icon: RiServiceLine,
    },
    {
      link: "#projects",
      icon: RiProjectorLine,
    },
    {
      link: "#contact",
      icon: MdOutlinePermContactCalendar,
    },
  ],
  hero: {
    title: "Web Developer",
    firstName: "Mahendra",
    LastName: "Jadamal",
    btnText: "Hire Me",
    image: Hero_person,
    hero_content: [
      {
        count: "5+",
        text: "Years of Experinse in Web development",
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
        para: "I specialize in building interactive user interfaces and single-page applications using React.js",
        logo: reactjs,
        level: 4,
      },
      {
        name: "React Native",
        para: "Experienced in developing cross-platform mobile applications using React Native framework.",
        logo: reactjs,
        level: 4,
      },
      {
        name: "Node js",
        para: "Proficient in server-side development with Node.js, creating scalable and efficient backend systems.",
        logo: nodejs,
        level: 4,
      },
      {
        name: "GraphQL",
        para: "Skilled in designing and implementing GraphQL APIs for efficient data fetching and manipulation.",
        logo: graphql,
        level: 4,
      },
      {
        name: "Material UI",
        para: "Familiar with designing and implementing responsive and visually appealing UI components using Material UI.",
        logo: mui,
        level: 4,
      },
    ],
    icon: MdArrowForward,
  },
  services: {
    title: "Services",
    subtitle: "WHAT I OFFER",
    service_content: [
      {
        title: "Web Development",
        para: "From concept to deployment, I offer comprehensive web development services tailored to your needs.",
        logo: services_logo1,
      },
      {
        title: "Mobile Development",
        para: "Develop high-quality mobile applications for both iOS and Android platforms, ensuring a seamless user experience.",
        logo: services_logo2,
      },
      {
        title: "Web3 / DAPP Development",
        para: " Specialize in decentralized application development using Web3 technologies, providing secure and decentralized solutions.",
        logo: services_logo3,
      },
    ],
  },
  Projects: {
    title: "Projects",
    subtitle: "MY CREATION",
    image: person_project,
    project_content: [
      {
        title: "Gym Website",
        image: project1,
      },
      {
        title: "Social Media web",
        image: project2,
      },
      {
        title: "Creative Website",
        image: project3,
      },
    ],
  },
  Testimonials: {
    title: "Testimonials",
    subtitle: "MY CLIENT REVIEWS",
    testimonials_content: [
      {
        review:
          "“Mahendra delivered exceptional work, exceeding our expectations. Highly recommended!”",
        img: avatar1,
        name: "Johnny",
      },
      // {
      //   review:
      //     "“In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstra”",
      //   img: avatar2,
      //   name: "Tom Alex",
      // },
      // {
      //   review:
      //     "“In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstra”",
      //   img: avatar3,
      //   name: "Johnny",
      // },
      // {
      //   review:
      //     "“In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstra”",
      //   img: avatar4,
      //   name: "ROBBIN",
      // },
    ],
  },
  Hireme: {
    title: "Hire Me",
    subtitle: "FOR YOUR PROJECTS",
    image1: Hireme_person,
    image2: Hireme_person2,
    para: "As an experienced web developer with over 5 years of hands-on experience, I offer expertise in building dynamic and responsive websites and applications tailored to your specific needs. Whether you're looking to create a stunning portfolio website, a robust e-commerce platform, or a cutting-edge web application, I have the skills and dedication to bring your vision to life. Let's collaborate on your next project and turn your ideas into reality.",
    btnText: "Hire Me",
  },
  Contact: {
    title: "Contect Me",
    subtitle: "GET IN TOUCH",
    social_media: [
      {
        text: "jadamalmahendra@gmail.com",
        icon: GrMail,
        link: "mailto:jadamalmahendra@gmail.com",
      },
      {
        text: "+919023309657",
        icon: MdCall,
        link: "https://wa.me/9023309657",
      },
      {
        text: "mj_choudhry",
        icon: BsInstagram,
        link: "https://www.instagram.com/mj_choudhry/",
      },
    ],
  },
  Footer: {
    text: "All © Copy Right Reserved 2024",
  },
};
