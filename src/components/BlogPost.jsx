import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Choose Prism or default
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style (e.g., atomDark)
import { loadBlogPost } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css'; // Reuse or create specific styles
import Navbar from '../Layouts/Navbar';
import { LuCopy, LuCheck } from "react-icons/lu"; // Icons for copy button

// Custom Code component for ReactMarkdown
const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text'; // Default to plain text if no language detected
  const codeText = String(children).replace(/\n$/, ''); // Ensure it's a string and remove trailing newline

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // Reset after 1.5s
    }, (err) => {
      console.error('Failed to copy text: ', err);
      // You could add user feedback here (e.g., toast notification)
    });
  }, [codeText]);

  return !inline && match ? (
    <div className={styles.codeBlockWrapper}> {/* Wrapper for positioning */} 
      <SyntaxHighlighter
        style={atomDark} // Apply the chosen theme
        language={language}
        PreTag="div" // Use div instead of pre for flexibility
        {...props}
      >
        {codeText}
      </SyntaxHighlighter>
      <button 
        onClick={handleCopy} 
        className={styles.copyButton}
        aria-label={isCopied ? 'Copied' : 'Copy code'}
      >
        {isCopied ? <LuCheck size={16}/> : <LuCopy size={16}/>}
      </button>
    </div>
  ) : (
    <code className={inline ? styles.inlineCode : className} {...props}>
      {children}
    </code>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
      const loadedPost = await loadBlogPost(slug);
      if (loadedPost) {
        setPost(loadedPost);
      } else {
        setError(true); // Post not found or failed to load
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className={styles.loading}>Loading post...</div>; // Add basic loading indicator
  }

  if (error || !post) {
    console.error('BlogPost Error: Post not found or error loading.', { error, post }); // Log error state
    return <div className={styles.error}>Post not found.</div>;
  }

  // Log the post object to check its content
  console.log('Rendering BlogPost with post data (expecting htmlContent):', post);

  return (
    <section id="blog-post" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>{post.title} - Jadamal Mahendra Blog</title>
        {/* You could generate a meta description from post content snippet here */}
        {/* <meta name="description" content={post.content.substring(0, 150) + '...'} /> */}
      </Helmet>
      <div className="container">
      <Navbar />

        <article className={styles.postArticle}>
          <header className={styles.postHeader}>
            {/* Display Featured Image if available */}
            {post.featuredImage && (
              <img 
                src={post.featuredImage} 
                alt={`${post.title} featured image`} 
                className={styles.featuredImage} // Add styles for this
              />
            )}
            <h1 className={styles.postTitleArticle}>{post.title}</h1>
            <time dateTime={post.date.toISOString()} className={styles.postDateArticle}>
              {post.date.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </time>
            {/* Display Tags if available */}
            {post.tags && post.tags.length > 0 && (
              <div className={styles.tagsContainer}> 
                {post.tags.map(tag => (
                  <span key={tag} className={styles.tagItem}>{tag}</span>
                ))}
              </div>
            )}
          </header>
          
          {/* Use ReactMarkdown with custom CodeBlock component */}
          <div className={styles.postContent}>
             <ReactMarkdown
               components={{
                 code: CodeBlock, // Override default code rendering
               }}
             >
               {post.content} 
             </ReactMarkdown>
          </div>

          <footer className={styles.postFooter}>
            <Link to="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default BlogPost; 