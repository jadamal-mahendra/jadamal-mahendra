import { useEffect, useRef } from 'react';

// Simple throttle function using setTimeout
function throttle(func, delay) {
  let timeoutId = null;
  let lastExecTime = 0;

  return function(...args) {
    const context = this;
    const currentTime = Date.now();

    const execute = () => {
      func.apply(context, args);
      lastExecTime = currentTime;
      timeoutId = null; // Clear timeout after execution
    };

    if (!timeoutId) {
        // Allow immediate execution if enough time has passed since last execution
        if (currentTime - lastExecTime >= delay) {
             execute();
        } else {
            // Otherwise, schedule execution after remaining delay
             timeoutId = setTimeout(execute, delay - (currentTime - lastExecTime));
        }
    }
    // If timeoutId exists, the function call is ignored (throttled)
    // until the timeout clears. Or, could implement rescheduling if needed.
  };
}


/**
 * Custom hook to apply a proximity glow effect to child elements.
 * @param {React.RefObject<HTMLElement>} containerRef - Ref to the container element whose children will get the effect.
 * @param {string} cardSelector - CSS selector for the card elements within the container.
 * @param {number} [throttleDelay=16] - Throttle delay in milliseconds (default ~60fps).
 */
function useGlowEffect(containerRef, cardSelector, throttleDelay = 16) {
  // Use a ref for the throttled function to ensure it's stable across renders
  const throttledMouseMoveRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Query cards once when the container is ready
    const cards = container.querySelectorAll(cardSelector);
    if (cards.length === 0) {
        console.warn(`useGlowEffect: No elements found with selector "${cardSelector}" inside the container.`);
        return; // No cards found, no need to add listener
    }

    // Define the core mouse move logic
    const handleMouseMove = (e) => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // Calculate mouse position relative to the card's top-left corner
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set the CSS variables directly on the card element
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    // Create the throttled version only once
    if (!throttledMouseMoveRef.current) {
        throttledMouseMoveRef.current = throttle(handleMouseMove, throttleDelay);
    }

    // Add listener to the container
    container.addEventListener('mousemove', throttledMouseMoveRef.current);
    // console.log(`Glow effect listener attached for selector "${cardSelector}".`);

    // Cleanup function
    return () => {
      if (container && throttledMouseMoveRef.current) {
          container.removeEventListener('mousemove', throttledMouseMoveRef.current);
          // console.log(`Glow effect listener removed for selector "${cardSelector}".`);
      }
      // Optional: Reset styles on cleanup if needed, though they won't update without the listener
      cards.forEach(card => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
      // Clear the ref on cleanup (optional, helps if hook re-runs)
      // throttledMouseMoveRef.current = null;
    };

    // Dependencies: ref stability, selector changes, throttle delay changes
  }, [containerRef, cardSelector, throttleDelay]);
}

export default useGlowEffect; 