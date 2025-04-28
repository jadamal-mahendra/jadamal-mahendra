import { useRef, useEffect } from 'react';
import { throttle } from '../utils/throttle'; // Updated path

/**
 * Custom hook to apply a proximity glow effect to child elements.
 * Container detects mouse enter/leave, children use coordinates.
 * @param {React.RefObject<HTMLElement>} containerRef - Ref to the container element.
 * @param {string} cardSelector - CSS selector for the card elements.
 * @param {boolean} loading - Indicates whether the container is loading.
 * @param {number} [throttleDelay=16] - Throttle delay in milliseconds.
 */
function useGlowEffect(containerRef: React.RefObject<HTMLElement>, cardSelector: string, loading: boolean, throttleDelay: number = 16) {
  const throttledMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const activeClassName = 'glow-container-active'; // Class to add to container

  useEffect(() => {
    console.log(`[useGlowEffect] Effect running (loading: ${loading}) for selector: ${cardSelector}`); // Log effect run
    const container = containerRef.current;
    
    // --- Important: Only proceed if NOT loading AND container exists --- 
    if (loading || !container) {
      if (loading) console.log('[useGlowEffect] Skipping setup: still loading.');
      if (!container) console.log('[useGlowEffect] Skipping setup: Container not found yet.'); 
      return; // Don't attach listeners if loading or container not ready
    }
    // --- End check ---
    
    console.log('[useGlowEffect] Container found:', container); // Log container found

    // Query cards once
    const cards = container.querySelectorAll<HTMLElement>(cardSelector);
    console.log(`[useGlowEffect] Found ${cards.length} cards with selector: ${cardSelector}`); // Log card count
    if (cards.length === 0) {
      // console.warn(`useGlowEffect: No elements found with selector "${cardSelector}".`);
      return;
    }

    // Define the core mouse move logic - updates CHILD variables based on CONTAINER coords
    const handleMouseMove = (e: MouseEvent) => {
      // Log only once per move sequence for less spam
      // console.log('[useGlowEffect] MouseMove'); 
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        // Calculate mouse position relative to the card's top-left corner
        // using the container's event data
        const x = e.clientX - cardRect.left;
        const y = e.clientY - cardRect.top;

        // Set the CSS variables directly on the CARD element
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        // Log coords for the first card for debugging
        // if (index === 0) { 
        //   console.log(`[useGlowEffect] Card 0 Coords: x=${x}, y=${y}`);
        // }
      });
    };

    // Create the throttled version only once
    if (!throttledMouseMoveRef.current) {
      throttledMouseMoveRef.current = throttle(handleMouseMove, throttleDelay);
    }

    // --- Mouse Enter/Leave for container (Keep this) --- 
    const handleMouseEnter = () => {
      console.log('[useGlowEffect] MouseEnter container, adding active class.'); // Log enter
      container.classList.add(activeClassName);
    };

    const handleMouseLeave = () => {
      console.log('[useGlowEffect] MouseLeave container, removing active class.'); // Log leave
      container.classList.remove(activeClassName);
      // Reset card variables on leave
      cards.forEach(card => {
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
      });
    };
    // --- End Enter/Leave ---

    // Add listeners to the container
    const currentThrottledHandler = throttledMouseMoveRef.current as EventListener;
    container.addEventListener('mousemove', currentThrottledHandler);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    console.log('[useGlowEffect] Event listeners ADDED.'); // Log listener add

    // Cleanup function
    return () => {
      console.log('[useGlowEffect] Cleanup running.'); // Log cleanup
      // Check container exists before removing listeners
      if (container) { 
        if (throttledMouseMoveRef.current) {
          container.removeEventListener('mousemove', currentThrottledHandler);
        }
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.classList.remove(activeClassName); // Remove class on cleanup
      }
      // Reset card variables even if container is gone
      const currentCards = container?.querySelectorAll<HTMLElement>(cardSelector) || cards; // Use potentially stale cards if container gone
      currentCards.forEach(card => {
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
      });
    };

  }, [containerRef, cardSelector, throttleDelay, loading]);
}

export default useGlowEffect; 