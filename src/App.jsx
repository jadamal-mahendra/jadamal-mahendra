// import components
import Hero from "./components/Hero";
import Navbar from "./Layouts/Navbar";
// Removed commented-out imports
import Experience from "./components/Experience"; // Added Experience
import Awards from "./components/Awards";
import Contact from "./components/Contact";
// import { useEffect } from "react";
// import content
// import { content } from "./Content";

// Import custom CSS (assuming it's needed globally or we use modules later)
import "./index.css"; 

const App = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Hero />
      {/* Removed commented-out components */}
      <Experience /> {/* Added Experience component */}
      <Awards />
      <Contact />
      <footer className="app-footer">
        <p className="app-footer-text">
          &copy; {new Date().getFullYear()} Jadamal Mahendra. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
