/**
 * Simple throttle function using setTimeout.
 * Limits the execution of a function to once per specified delay.
 * @param {Function} func The function to throttle.
 * @param {number} delay The throttle delay in milliseconds.
 * @returns {Function} The throttled function.
 */
export function throttle(func, delay) {
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
    // until the timeout clears.
  };
} 