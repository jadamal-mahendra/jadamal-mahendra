import { useState, useEffect } from "react";
import { content } from "../Content";
import { LuMenu, LuX } from "react-icons/lu";

const Navbar = () => {
  const { nav, hero } = content;
  const [showMenu, setShowMenu] = useState(false);
  const [active, setActive] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to generate class names
  const getNavClasses = () => {
    let classes = "navbar";
    if (isScrolled) {
      classes += " scrolled";
    }
    return classes;
  };

  const getMobileOverlayClasses = () => {
    let classes = "navbar-mobile-overlay";
    if (showMenu) {
      classes += " open";
    }
    return classes;
  };

  const getNavLinkClass = (index) => {
    let classes = "navbar-link";
    if (index === active) {
      classes += " active";
    }
    return classes;
  };

  return (
    <nav className={getNavClasses()}>
      <div className="navbar-container container">
        {/* Logo/Name */}
        <a href="#home" className="navbar-brand">
          {hero.firstName} {hero.LastName}
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-links-desktop">
          {nav.map((item, i) => (
            <a
              key={i}
              href={item.link}
              onClick={() => setActive(i)}
              className={getNavLinkClass(i)}
            >
              {item.link.substring(1).charAt(0).toUpperCase() + item.link.substring(2)}
            </a>
          ))}
          <a href="#contact" onClick={() => setActive(nav.length)} className="btn navbar-cta">
            Contact Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setShowMenu(!showMenu)}
          aria-label={showMenu ? "Close menu" : "Open menu"}
          aria-expanded={showMenu}
        >
          {showMenu ? <LuX size={28} /> : <LuMenu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={getMobileOverlayClasses()}>
          <div className="navbar-mobile-links">
            {nav.map((item, i) => (
              <a
                key={i}
                href={item.link}
                onClick={() => {
                  setActive(i);
                  setShowMenu(false);
                }}
                className={getNavLinkClass(i)}
              >
                {item.link.substring(1).charAt(0).toUpperCase() + item.link.substring(2)}
              </a>
            ))}
            <a href="#contact" onClick={() => { setActive(nav.length); setShowMenu(false);}} className="btn">
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
