import { useEffect, useRef } from 'react';
import { throttle } from '../utils/throttle'; // Assuming throttle utility exists

/**
 * Custom hook to apply a proximity glow effect to child elements.
 * Container detects mouse enter/leave, children use coordinates.
 * @param {React.RefObject<HTMLElement>} containerRef - Ref to the container element.
 * @param {string} cardSelector - CSS selector for the card elements.
 * @param {number} [throttleDelay=16] - Throttle delay in milliseconds.
 */
function useGlowEffect(containerRef, cardSelector, throttleDelay = 16) {
  const throttledMouseMoveRef = useRef(null);
  const activeClassName = 'glow-container-active'; // Class to add to container

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Query cards once
    const cards = container.querySelectorAll(cardSelector);
    if (cards.length === 0) {
      // console.warn(`useGlowEffect: No elements found with selector "${cardSelector}".`);
      return;
    }

    // Define the core mouse move logic - updates CHILD variables based on CONTAINER coords
    const handleMouseMove = (e) => {
      // Get container rect ONCE per move event
      const containerRect = container.getBoundingClientRect(); 

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        // Calculate mouse position relative to the card's top-left corner
        // using the container's event data
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;

        // Set the CSS variables directly on the CARD element
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    // Create the throttled version only once
    if (!throttledMouseMoveRef.current) {
      throttledMouseMoveRef.current = throttle(handleMouseMove, throttleDelay);
    }

    // --- Mouse Enter/Leave for container (Keep this) --- 
    const handleMouseEnter = () => {
      container.classList.add(activeClassName);
    };

    const handleMouseLeave = () => {
      container.classList.remove(activeClassName);
      // Reset card variables on leave
      cards.forEach(card => {
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
      });
    };
    // --- End Enter/Leave ---

    // Add listeners to the container
    container.addEventListener('mousemove', throttledMouseMoveRef.current);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function
    return () => {
      if (container) {
        if (throttledMouseMoveRef.current) {
          container.removeEventListener('mousemove', throttledMouseMoveRef.current);
        }
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.classList.remove(activeClassName); // Remove class on cleanup
      }
      // Reset card variables on cleanup
      cards.forEach(card => {
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
      });
    };

  }, [containerRef, cardSelector, throttleDelay]);
}

export default useGlowEffect; 