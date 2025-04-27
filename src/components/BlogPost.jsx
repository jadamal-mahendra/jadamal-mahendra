import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Highlight, themes } from 'prism-react-renderer';
import { loadBlogPost } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css'; // Reuse or create specific styles
import Navbar from '../Layouts/Navbar';
import { LuCopy, LuCheck } from "react-icons/lu"; // Icons for copy button
import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon

// Custom Code component for ReactMarkdown using prism-react-renderer
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
    });
  }, [codeText]);

  if (inline) {
    return <code className={styles.inlineCode} {...props}>{children}</code>;
  }

  return (
    <Highlight code={codeText} language={language} theme={themes.dracula}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <div className={styles.codeBlockWrapper}> {/* Wrapper for positioning */}
          <pre className={`${highlightClassName} ${styles.codeBlockPre}`} style={style}>
            {tokens.map((line, i) => {
              // Get line props, remove key before spreading
              const lineProps = getLineProps({ line, key: i });
              const lineKey = lineProps.key;
              delete lineProps.key;
              return (
                // Pass key directly
                <div key={lineKey} {...lineProps}>
                  {line.map((token, key) => {
                    // Get token props, remove key before spreading
                    const tokenProps = getTokenProps({ token, key });
                    const tokenKey = tokenProps.key;
                    delete tokenProps.key;
                    // Pass key directly
                    return (
                      <span key={tokenKey} {...tokenProps} />
                    );
                  })}
                </div>
              );
            })}
          </pre>
          <button
            onClick={handleCopy}
            className={styles.copyButton}
            aria-label={isCopied ? 'Copied' : 'Copy code'}
          >
            {isCopied ? <LuCheck size={16}/> : <LuCopy size={16}/>}
          </button>
        </div>
      )}
    </Highlight>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Set the current URL once the component mounts (client-side)
    setCurrentUrl(window.location.href);

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

  // Construct the LinkedIn share URL
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  // --- Prepare SEO data ---
  const pageTitle = `${post.title} - Jadamal Mahendra Blog`;
  const metaDescription = cleanDescription(post.content, 160); // Standard meta description length
  const ogDescription = cleanDescription(post.content, 300); // Longer for Open Graph
  const canonicalUrl = currentUrl || `${publicSiteUrl}/blog/${post.slug}`; // Use dynamic URL if available, else construct
  
  // --- Robust Image URL Construction ---
  let featuredImageUrl = `${publicSiteUrl}/assets/default-og-image.png`; // Default fallback
  if (post.featuredImage) {
    if (post.featuredImage.startsWith('http')) {
        featuredImageUrl = post.featuredImage; // Use as is if absolute
    } else {
        // Use URL constructor for robust joining, ensuring leading slash handling
        try {
            featuredImageUrl = new URL(post.featuredImage, publicSiteUrl).href;
        } catch (e) {
            console.error(`Error constructing featured image URL from path: ${post.featuredImage}`, e);
            // Keep the default fallback if URL construction fails
        }
    }
  }
  // --- End Robust Image URL Construction ---

  const authorName = "Jadamal Mahendra"; // Replace with your name

  return (
    <section id="blog-post" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>{post.title} - Jadamal Mahendra Blog</title>
        <meta name="description" content={post.content.substring(0, 300) + '...'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 300) + '...'} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Jadamal Mahendra Blog" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.featuredImageAlt} />
 
        
        
        {/* You could generate a meta description from post content snippet here */}
        {/* <meta name="description" content={post.content.substring(0, 150) + '...'} /> */}
      </Helmet>
      <div className="container">

        <article className={styles.postArticle}>
          <header className={styles.postHeader}>
            {/* Display Featured Image if available */}
            {/* {post.featuredImage && (
              <img 
                src={post.featuredImage} 
                alt={`${post.title} featured image`} 
                className={styles.featuredImage} // Add styles for this
              />
            )} */}
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
                 h1: () => null, // Add an override for h1 to render nothing
               }}
             >
               {post.content} 
             </ReactMarkdown>
          </div>

          <footer className={styles.postFooter}>
            <Link to="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
            {/* Add LinkedIn Share Link */}
            <a 
              href={linkedInShareUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.shareLink} // Add a class for styling
              aria-label="Share this post on LinkedIn"
            >
              <FaLinkedin size={18} /> Share on LinkedIn
            </a>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default BlogPost; 