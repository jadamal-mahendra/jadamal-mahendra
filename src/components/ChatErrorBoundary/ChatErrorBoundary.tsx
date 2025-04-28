import React from 'react';

// Define props interface
interface ChatErrorBoundaryProps {
  children: React.ReactNode;
}

// Define state interface
interface ChatErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ChatErrorBoundary extends React.Component<ChatErrorBoundaryProps, ChatErrorBoundaryState> {
  constructor(props: ChatErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error("Chat Widget Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // Keep it simple to avoid errors within the boundary itself
      return (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '300px',
            padding: '1rem',
            border: '1px solid var(--color-error-border, #f5c6cb)',
            borderRadius: '8px',
            backgroundColor: 'var(--color-error-bg, #f8d7da)',
            color: 'var(--color-error-text, #721c24)',
            zIndex: 999,
            boxShadow: '0 4px 12px var(--color-shadow, rgba(0,0,0,0.1))',
            fontFamily: 'sans-serif'
          }}
        >
          <p style={fallbackStyles.fallbackText}>
            Oops! The chat widget encountered an error.
          </p>
          <p style={fallbackStyles.fallbackDetail}>
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
// Use React.CSSProperties for typing
const fallbackStyles: { [key: string]: React.CSSProperties } = {
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