import { useState, useEffect } from "react";
import { content } from "../Content";
import { LuMenu, LuX } from "react-icons/lu";
import styles from './Navbar.module.css';

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

  // Helper function to generate class names dynamically
  const getNavClasses = () => {
    let classNames = [styles.navbar];
    if (isScrolled) {
      classNames.push(styles.scrolled);
    }
    return classNames.join(' ');
  };

  const getMobileOverlayClasses = () => {
    let classNames = [styles.navbarMobileOverlay];
    if (showMenu) {
      classNames.push(styles.open);
    }
    return classNames.join(' ');
  };

  const getNavLinkClass = (index) => {
    let classNames = [styles.navbarLink];
    if (index === active) {
      classNames.push(styles.active);
    }
    return classNames.join(' ');
  };

  return (
    <nav className={getNavClasses()}>
      <div className={`${styles.navbarContainer} container`}>
        {/* Logo/Name */}
        <a href="#home" className={styles.navbarBrand} onClick={() => setActive(0)}>
          {hero.firstName} {hero.LastName}
        </a>

        {/* Desktop Navigation */}
        <div className={styles.navbarLinksDesktop}>
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
          <a href="#contact" onClick={() => setActive(nav.length)} className={`${styles.navbarCta} btn`}>
            Contact Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.navbarMobileToggle}
          onClick={() => setShowMenu(!showMenu)}
          aria-label={showMenu ? "Close menu" : "Open menu"}
          aria-expanded={showMenu}
        >
          {showMenu ? <LuX size={28} /> : <LuMenu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={getMobileOverlayClasses()}>
          <div className={styles.navbarMobileLinks}>
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
            <a href="#contact" onClick={() => { setActive(nav.length); setShowMenu(false);}} className={`${styles.navbarLink} btn`}>
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
