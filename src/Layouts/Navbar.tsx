import React, { useState, useEffect } from "react";
// import { Link as ScrollLink } from "react-scroll"; // Remove unused import
// import { Link as RouterLink, NavLink, useLocation } from "react-router-dom"; // Removed RouterLink, NavLink
import { useLocation } from "react-router-dom"; // Keep useLocation
import { content } from "../config/content";
import { LuMenu, LuX, LuSun, LuMoon } from "react-icons/lu";
import styles from './Navbar.module.css';
// Import specific types
import { NavItem, HeroContent } from '../types/content'; 

// Props interface for Navbar
interface NavbarProps {
    currentTheme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTheme, toggleTheme }) => {
    // Use imported types for content destructuring
    const { nav, hero }: { nav: NavItem[], hero: HeroContent } = content;
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();
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
      const classNames = [styles.navbar];
      if (isScrolled) {
        classNames.push(styles.scrolled);
      }
      return classNames.join(' ');
    };

    const getMobileOverlayClasses = () => {
      const classNames = [styles.navbarMobileOverlay];
      if (showMenu) {
        classNames.push(styles.open);
      }
      return classNames.join(' ');
    };

    const getNavLinkClass = (path: string) => {
      const classNames = [styles.navbarLink];
      if (path === '#home' && location.pathname === '/') {
        classNames.push(styles.active);
      } else if (path !== '#home' && path !== '/blog' && location.pathname.startsWith(path)) { // Adjust condition if needed
        classNames.push(styles.active);
      } else if (path === '/blog' && location.pathname.startsWith('/blog')) { // Specific check for blog
        classNames.push(styles.active);
      }
      return classNames.join(' ');
    };

    const getCtaButtonClass = (isMobile = false) => {
      const baseClass = isMobile ? styles.navbarLink : styles.navbarCta;
      return `${baseClass} btn`;
    };

    const getCorrectHref = (link: string) => {
      // If it's the blog link, always return /blog
      if (link === '/blog') {
        return '/blog';
      }
      // If it's a hash link (starts with #) and we are NOT on the home page
      if (link.startsWith('#') && location.pathname !== '/') {
        // Prepend / to navigate home first
        return `/${link}`;
      } 
      // Otherwise (hash link on home page, or other type of link), return as is
      return link;
    };

    return (
      <nav className={getNavClasses()}>
        <div className={`${styles.navbarContainer} container`}>
          {/* Logo/Name */}
          <a href="/" className={styles.navbarBrand}>
            {hero.firstName} {hero.LastName}
          </a>

          {/* Desktop Navigation */}
          <div className={styles.navbarLinksDesktop}>
            {nav.map((item: NavItem) => (
              <a
                key={item.link}
                href={getCorrectHref(item.link)}
                className={getNavLinkClass(item.link)}
              >
                {item.link.startsWith('#') 
                  ? item.link.substring(1).charAt(0).toUpperCase() + item.link.substring(2) 
                  : item.text || 'Link'}
              </a>
            ))}
            <a href={getCorrectHref('/blog')} className={getNavLinkClass('/blog')}>
              Blog
            </a>
            {/* Theme Toggle Button (Desktop) */}
            <button
              onClick={toggleTheme}
              className={styles.themeToggleButton} 
              aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {currentTheme === 'light' ? <LuMoon size={20} /> : <LuSun size={20} />}
            </button>
            <a href={getCorrectHref('#contact')} className={getCtaButtonClass()}>
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
              {nav.map((item: NavItem) => (
                <a
                  key={item.link}
                  href={getCorrectHref(item.link)}
                  onClick={() => setShowMenu(false)}
                  className={getNavLinkClass(item.link)}
                >
                  {item.link.startsWith('#') 
                    ? item.link.substring(1).charAt(0).toUpperCase() + item.link.substring(2) 
                    : item.text || 'Link'}
                </a>
              ))}
              <a href={getCorrectHref('/blog')} onClick={() => setShowMenu(false)} className={getNavLinkClass('/blog')}>
                Blog
              </a>
              {/* Theme Toggle Button (Mobile) */}
              <button
                onClick={() => { toggleTheme(); setShowMenu(false); }}
                className={styles.themeToggleButtonMobile} 
                aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
              >
                {currentTheme === 'light' ? <LuMoon size={22} /> : <LuSun size={22} />}
                <span style={{ marginLeft: '0.5rem' }}>
                  Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
                </span>
              </button>
              <a href={getCorrectHref('#contact')} onClick={() => setShowMenu(false)} className={getCtaButtonClass(true)}>
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;
