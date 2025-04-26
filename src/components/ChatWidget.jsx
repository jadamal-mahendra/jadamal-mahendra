import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css'; // We'll create this CSS file next
import { LuBot, LuX, LuSendHorizonal, LuLoader2 } from "react-icons/lu"; // Icons
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    // Initial greeting message from the AI
    { role: 'assistant', content: "Hi there! I'm Jadamal's AI assistant. How can I help you learn more about his work?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Ref to auto-scroll

  // Effect to scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Function to send message to the backend API
  const handleSendMessage = async (event) => {
    event.preventDefault();
    const userMessageContent = inputValue.trim();
    if (!userMessageContent || isLoading) return;

    const newUserMessage = { role: 'user', content: userMessageContent };
    
    // Add user message to state immediately
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue(''); // Clear input
    setIsLoading(true); // Set loading state

    // Prepare history (e.g., last 4 messages, excluding initial system message if needed)
    // OpenAI works best with pairs of user/assistant messages
    const historyToSend = messages
        .slice(-4) // Adjust number of history messages as needed
        .filter(msg => msg.role !== 'system'); // Filter out system messages if they were part of state

    try {
      const response = await fetch('/api/chat', { // Relative path works with Vercel proxy
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageContent,
          history: historyToSend, 
        }),
      });

      if (!response.ok) {
        // Try to parse error message from backend
        let errorData = { error: `API Error: ${response.statusText}` };
        try {
            errorData = await response.json();
        } catch (e) { /* Ignore parsing error, use statusText */ }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.reply };

      // Add AI response to state
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Failed to send message:", error);
      // Add an error message to the chat
      const errorMessage = { 
          role: 'assistant', 
          content: `Sorry, I couldn't get a response. ${error.message}`
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);

    } finally {
      setIsLoading(false); // Reset loading state regardless of success/failure
    }
  };

  return (
    <div className={styles.chatWidgetContainer}>
      {/* Floating Action Button (FAB) */}
      <button 
        className={`${styles.fab} ${isOpen ? styles.fabHidden : ''}`}
        onClick={toggleChat}
        aria-label="Open Chat"
      >
        <LuBot size={28} />
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ''}`}>
        {/* Header - Updated */}
        <div className={styles.chatHeader}>
          {/* Wrapper for image and name */}
          <div className={styles.headerInfo}>
            <img 
              src="/2.png" // Assuming this is the correct path to your image
              alt="Jadamal Mahendra" 
              className={styles.headerImage} 
            />
            <h3>Jadamal Mahendra</h3>
          </div>
          <button onClick={toggleChat} className={styles.closeButton} aria-label="Close Chat">
            <LuX size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className={styles.messagesArea}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
              {/* Render assistant messages with Markdown, user messages as plain text */}
              {msg.role === 'assistant' ? (
                <div className={styles.messageContent}> 
                  <ReactMarkdown
                    components={{
                      // Ensure links open in a new tab and are secure
                      a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <span className={styles.messageContent}>{msg.content}</span>
              )}
            </div>
          ))}
          {/* Optional: Loading indicator */}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistant}`}> 
                <LuLoader2 className={styles.loadingIcon} size={18}/>
            </div>
          )} 
          {/* Empty div to target for scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className={styles.inputArea} onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask about skills, projects..."
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
            className={styles.inputField}
            aria-label="Chat message input"
          />
          <button type="submit" disabled={isLoading || !inputValue} className={styles.sendButton} aria-label="Send Message">
            {isLoading ? <LuLoader2 className={styles.loadingIconSmall} size={18}/> : <LuSendHorizonal size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget; 