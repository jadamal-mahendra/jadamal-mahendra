/**
 * Simple throttle function using setTimeout.
 * Limits the execution of a function to once per specified delay.
 * @param {Function} func The function to throttle.
 * @param {number} delay The throttle delay in milliseconds.
 * @returns {Function} The throttled function.
 */
// Basic throttle function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExec = 0;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    const elapsed = Date.now() - lastExec;

    const later = () => {
      timeoutId = null;
      lastExec = Date.now();
      func.apply(context, args);
    };

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (elapsed > delay) {
      later();
    } else {
      timeoutId = setTimeout(later, delay - elapsed);
    }
  };
} 