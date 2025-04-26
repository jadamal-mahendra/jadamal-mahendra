import React from 'react';

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("Chat Widget Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // Keep it simple to avoid errors within the boundary itself
      return (
        <div style={styles.fallbackContainer}>
          <p style={styles.fallbackText}>
            Oops! The chat widget encountered an error.
          </p>
          <p style={styles.fallbackDetail}>
             ({this.state.error?.message || 'Unknown Error'}) 
          </p>
          {/* Optional: Add a button to try reloading or contact support */}
          {/* <button onClick={() => window.location.reload()}>Refresh Page</button> */}
        </div>
      );
    }

    // If no error, render the children normally
    return this.props.children; 
  }
}

// Basic inline styles for fallback UI (can be moved to CSS modules)
const styles = {
  fallbackContainer: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    width: '300px',
    padding: '1rem',
    border: '1px solid #fecaca', // Red-200
    borderRadius: '8px',
    backgroundColor: '#fef2f2', // Red-50
    color: '#b91c1c', // Red-700
    zIndex: 999,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'sans-serif'
  },
  fallbackText: {
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0'
  },
  fallbackDetail: {
      fontSize: '0.8rem',
      margin: '0',
      opacity: 0.8
  }
};

export default ChatErrorBoundary; 