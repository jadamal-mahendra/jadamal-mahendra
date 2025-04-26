import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css'; // We'll create this CSS file next
import { LuBot, LuX, LuSendHorizonal, LuLoader2, LuCalendar, LuShare2 } from "react-icons/lu"; // Icons
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

// Import Card Components (Assuming they exist)
import SkillCard from './SkillCard'; // Added import
import ExperienceCard from './ExperienceCard'; // Added import
import ServiceCard from './ServiceCard'; // Added import

// Import structured data (Assuming the path and export name are correct)
import { content as websiteContent } from '../Content'; // Adjust path if necessary

const CHAT_HISTORY_KEY = 'chatHistory';
const THREAD_ID_KEY = 'chatThreadId';
const WORD_LIMIT = 150; // Define the word limit

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Function to get initial messages from localStorage or default
  const getInitialMessages = () => {
    try {
      const storedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        // Basic validation: check if it's an array and has at least one item
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
             // If the last message is a loading skeleton placeholder from a previous session, remove it
            if (parsedMessages[parsedMessages.length - 1]?.role === 'assistant' && parsedMessages[parsedMessages.length - 1]?.isSkeleton) {
                return parsedMessages.slice(0, -1);
            }
          return parsedMessages;
        }
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage:", error);
      // Clear invalid data if parsing fails
      localStorage.removeItem(CHAT_HISTORY_KEY); 
    }
    // Default initial message if nothing valid is found
    return [{ role: 'assistant', content: "Hi there! I'm Jadamal's AI assistant. How can I help you learn more about his work?" }];
  };

  const getInitialThreadId = () => {
      try {
          return localStorage.getItem(THREAD_ID_KEY) || null;
      } catch (error) {
          console.error("Failed to get thread ID from localStorage:", error);
          return null;
      }
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputValue, setInputValue] = useState('');
  const [wordCount, setWordCount] = useState(0); // State for word count
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(getInitialThreadId);
  const [isSendingTranscript, setIsSendingTranscript] = useState(false); // State for transcript sending
  const [transcriptStatus, setTranscriptStatus] = useState(null); // 'success' or 'error' or null
  const messagesEndRef = useRef(null);

  // Predefined initial suggestion prompts
  const suggestedPrompts = [
    "What are your key skills?",
    "Tell me about your recent projects.",
    "How many years of experience do you have?",
  ];

  // Effect to scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Effect to save messages to localStorage
  useEffect(() => {
    try {
        const messagesToSave = messages.filter(msg => !msg.isSkeleton);
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
        console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  // Effect to save threadId to localStorage
  useEffect(() => {
    try {
        if (currentThreadId) {
            localStorage.setItem(THREAD_ID_KEY, currentThreadId);
        } else {
            // If threadId becomes null (e.g., after clearing), remove it
            localStorage.removeItem(THREAD_ID_KEY);
        }
    } catch (error) {
        console.error("Failed to save thread ID to localStorage:", error);
    }
  }, [currentThreadId]);

  // Effect for initial suggestions
  useEffect(() => {
    if (isOpen && messages.length === 1 && messages[0].content.startsWith("Hi there!")) {
       setCurrentSuggestions(suggestedPrompts);
    } else if (!isOpen) {
      setCurrentSuggestions([]);
    }
  }, [isOpen, messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  // Updated input handler with word limit
  const handleInputChange = (event) => {
    const value = event.target.value;
    const words = value.trim().split(/\\s+/).filter(Boolean); // Split by whitespace, filter empty
    const currentCount = words.length;

    if (currentCount <= WORD_LIMIT) {
      setInputValue(value);
      setWordCount(currentCount);
    } 
    // Optionally: If count > WORD_LIMIT, maybe show an error or just prevent update
    // For now, we just don't update state if the limit is exceeded
  };

  // Refactored function to send message and get AI response
  const sendMessage = async (messageContent) => {
    if (!messageContent.trim() || isLoading) return;
    const newUserMessage = { role: 'user', content: messageContent };
    const historyToSend = messages.slice(-4).filter(msg => msg.role !== 'system');

    // Add user message & show loading state (no empty assistant message needed)
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');
    setCurrentSuggestions([]);
    setIsLoading(true);

    try {
      // --- Call backend with Assistants API --- 
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            message: messageContent, 
            threadId: currentThreadId
        })
      });

      // Standard JSON response handling
      if (!response.ok) {
         let errorData = { error: `API Error: ${response.statusText}` };
         try { errorData = await response.json(); } catch (e) { /* Ignore parsing error */ }
         // Include threadId from error payload if available
         const errorThreadId = errorData.threadId ? ` (Thread: ${errorData.threadId})` : '';
         throw new Error(errorData.error || `HTTP error! status: ${response.status}${errorThreadId}`);
      }

      // Expect { text, signal, suggestions, threadId } 
      const data = await response.json();
      
      // Basic validation
      if (typeof data.text !== 'string' || !Array.isArray(data.suggestions) || typeof data.threadId !== 'string') {
        throw new Error("Invalid response format from server.");
      }

      // Set state based on the response
      const aiMessage = {
        role: 'assistant',
        content: data.text,
        signal: data.signal || null // Store the signal (or null)
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setCurrentSuggestions(data.suggestions || []);

      if (data.threadId && data.threadId !== currentThreadId) {
          console.log(`Received new thread ID: ${data.threadId}`);
          setCurrentThreadId(data.threadId);
      }

    } catch (error) {
      console.error("Failed to send/process message (Assistant API):".red, error);
      // Add error message to chat
      const errorMessage = { role: 'assistant', content: `Sorry, I couldn't get a response. ${error.message}` };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setCurrentSuggestions([]); // Clear suggestions on error
    } finally {
      setIsLoading(false); // Turn off loading indicator
    }
  };

  // Form submission handler (uses sendMessage)
  const handleFormSubmit = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  // Suggestion button click handler (uses sendMessage)
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    sendMessage(suggestion);
  };

  // Define the Calendly link URL
  const calendlyUrl = "https://calendly.com/jadamalmahendra/30min";

  // Extract data for cards (handle potential missing data gracefully)
  const skillsData = websiteContent?.skills?.skills_content || [];
  const experienceData = websiteContent?.Experience?.experience_content || [];
  const servicesData = websiteContent?.services?.service_content || [];

  // --- NEW: Handle End Chat & Send Transcript --- 
  const handleEndChatClick = async () => {
    if (messages.length <= 1) { // Don't send if only initial message exists
        setTranscriptStatus({ type: 'info', message: 'Nothing to send yet.'});
        setTimeout(() => setTranscriptStatus(null), 3000);
        return;
    }

    setIsSendingTranscript(true);
    setTranscriptStatus(null); // Clear previous status

    try {
        const response = await fetch('/api/send-log', { // Use the new endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                fullHistory: messages, // Send the entire history
                threadId: currentThreadId 
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || `HTTP error ${response.status}`);
        }

        setTranscriptStatus({ type: 'success', message: 'Transcript Sent!' });
        // Optional: Clear local state/storage after successful send
        // setMessages(getInitialMessages()); // Reset to initial message
        // setCurrentThreadId(null); // Clear thread ID
        // localStorage.removeItem(CHAT_HISTORY_KEY);
        // localStorage.removeItem(THREAD_ID_KEY);
        // setIsOpen(false); // Close widget

    } catch (error) {
        console.error("Failed to send transcript:", error);
        setTranscriptStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
        setIsSendingTranscript(false);
        // Hide status message after a few seconds
        setTimeout(() => setTranscriptStatus(null), 5000); 
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
        <img 
          src="/2.png" // Assuming this is the correct path to your image
          alt="Jadamal Mahendra" 
          className={styles.fabImage} 
        />      </button>

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
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <h3 style={{fontSize: '1.2rem' , color: 'var(--color-white)' }}>Jadamal Mahendra</h3>
            </div>
          </div>
          <div className={styles.headerActions}> {/* Wrapper for buttons */}
              {/* Send Transcript Button */} 
              <button 
                onClick={handleEndChatClick}
                className={styles.headerButton} 
                disabled={isSendingTranscript || messages.length <= 1}
                title="Send chat transcript via email"
              >
                {isSendingTranscript ? <LuLoader2 className={styles.spinnerSmall} /> : <LuShare2 size={18} />}
              </button>
              {/* Close Button */} 
              <button onClick={toggleChat} className={styles.headerButton} aria-label="Close Chat">
                <LuX size={20} />
              </button>
          </div>
        </div>

        {/* Transcript Status Message */}
        {transcriptStatus && (
            <div className={`${styles.transcriptStatus} ${styles[transcriptStatus.type]}`}>
                {transcriptStatus.message}
            </div>
        )}

        {/* Messages Area */}
        <div className={styles.messagesArea}>
          {messages.map((msg, index) => (
            <React.Fragment key={index}> {/* Use Fragment for key */} 
              {/* Message Bubble */}
              <div className={`${styles.message} ${styles[msg.role]}`}>
                {/* Render assistant messages with Markdown, user messages as plain text */}
                {msg.role === 'assistant' ? (
                  <div className={styles.messageContent}> 
                    <ReactMarkdown
                      components={{
                        // Custom renderer for links (<a> tags)
                        a: ({ node, href, children, ...props }) => {
                          // Check if the link is the Calendly link
                          if (href === calendlyUrl) {
                            // Render as a styled link (button)
                            return (
                              <a 
                                href={href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.calendlyButton} // Apply button styles
                                {...props}
                              >
                                <LuCalendar size={16} style={{ marginRight: '0.4rem' }} /> {/* Add icon */}
                                Book a Meeting
                              </a>
                            );
                          } else {
                            // Render other links normally (opening in new tab)
                            return (
                              <a 
                                href={href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                {...props}
                              >
                                {children}
                              </a>
                            );
                          }
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className={styles.messageContent}>{msg.content}</span>
                )}
              </div>
              
              {/* --- Render Cards based on LAST message's signal --- */}
              {msg.role === 'assistant' && index === messages.length - 1 && (
                <>
                  {msg.signal === 'SKILLS' && skillsData.length > 0 && (
                    <div className={styles.cardsContainer}>
                      {skillsData.map((skill, idx) => 
                        <SkillCard key={`skill-${idx}`} {...skill} LogoComponent={skill.logo} />
                      )}
                    </div>
                  )}
                  {msg.signal === 'EXPERIENCE' && experienceData.length > 0 && (
                    <div className={styles.cardsContainer}>
                      {experienceData.map((exp, idx) => 
                        <ExperienceCard key={`exp-${idx}`} {...exp} />
                      )}
                    </div>
                  )}
                  {msg.signal === 'SERVICES' && servicesData.length > 0 && (
                    <div className={styles.cardsContainer}>
                      {servicesData.map((service, idx) => 
                         <ServiceCard key={`serv-${idx}`} {...service} LogoComponent={service.logo} />
                      )}
                    </div>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
          
          {/* Skeleton Loader - Render based on isLoading state */}
          {isLoading && (
            <div className={`${styles.message} ${styles.assistant}`} aria-live="polite"> 
              <div className={styles.skeletonContainer}>
                <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                <div className={styles.skeletonLine}></div>
                <div className={`${styles.skeletonLine} ${styles.skeletonLineMedium}`}></div>
              </div>
            </div>
          )}

          {/* Dynamic AI Suggestions - This block now handles initial suggestions too */}
          {!isLoading && currentSuggestions.length > 0 && (
             <div className={`${styles.suggestionsContainer} ${styles.dynamicSuggestionsContainer} ${styles.fixedSuggestions}`}> 
               {currentSuggestions.map((prompt, index) => (
                 <button 
                   key={`dyn-${index}`} 
                   className={styles.suggestionButton} 
                   onClick={() => handleSuggestionClick(prompt)}
                   disabled={isLoading}
                 >
                   {prompt}
                 </button>
               ))}
             </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className={styles.inputArea} onSubmit={handleFormSubmit}>
          <textarea // Assuming it's a textarea, adjust if it's an input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className={styles.inputField}
            rows="1" // Start with one row
            onInput={(e) => { // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            disabled={isLoading || isSendingTranscript}
          />
          {/* Word Counter */}
          <div className={styles.inputControls}>
            <span className={styles.wordCounter}>
              {wordCount}/{WORD_LIMIT}
            </span>
            <button 
              type="submit" 
              className={styles.sendButton} 
              disabled={isLoading || isSendingTranscript || !inputValue.trim()}
            >
              {isLoading ? <LuLoader2 className={styles.spinner} /> : <LuSendHorizonal />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget; 