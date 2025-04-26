import React, { useRef, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { loadBlogPosts } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css';
import Navbar from '../Layouts/Navbar';

// Removed the separate BlogCard component

const BlogList = () => {
  const { tag } = useParams();
  const allPosts = loadBlogPosts();
  // Ref for the main section element
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const posts = tag
    ? allPosts.filter(post => post.tags && post.tags.includes(decodeURIComponent(tag)))
    : allPosts;

  // Ref for the container holding the cards (could be the Masonry component's parent)
  // Or attach the listener to the document if cards are widespread
  const cardContainerRef = useRef(null);

  useEffect(() => {
    const container = cardContainerRef.current; // Or document.body
    if (!container) return;

    const cards = container.querySelectorAll(`.${styles.postCard}`); // Select cards within the container

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

    // Add listener to the container (or document)
    container.addEventListener('mousemove', handleMouseMove);
    console.log("Individual card mouse move listener attached.");

    // Cleanup function
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      console.log("Individual card mouse move listener removed.");
      // Optional: Reset styles on cleanup if needed
      cards.forEach(card => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    };
    // Add dependencies based on what might cause 'cards' to change,
    // or leave empty if the card structure is static after initial render.
    // If using Masonry, you might need to re-run this effect if items are added/removed.
  }, [/* dependencies like posts list if it changes */]);

  // ... (pageTitle, pageDescription, etc.) ...
  const pageTitle = tag ? `Posts tagged: "${decodeURIComponent(tag)}" - Blog` : "Blog - Jadamal Mahendra";
  const pageDescription = tag ? `Blog posts by Jadamal Mahendra tagged with ${decodeURIComponent(tag)}.` : "Read blog posts by Jadamal Mahendra on software development, React, Node.js, Web3, and more.";
  const headingTitle = tag ? `Tag: ${decodeURIComponent(tag)}` : "Blog";
  const subtitle = tag ? `${posts.length} post${posts.length !== 1 ? 's' : ''} found` : "Thoughts & Insights";


  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  // Function to handle card click navigation
  const handleCardClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    // Make sure the ref is attached to the correct element that contains ALL cards
    // This might be the <section>, the <div> container, or even the <Masonry> component
    // if it forwards refs or renders a suitable wrapper.
    <section ref={cardContainerRef} id="blog-list" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <div className="container">
        <Navbar />
         <h2 className="section-title" data-aos="fade-up">
          {headingTitle}
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          {subtitle}
        </h4>
        {tag && (
          <Link to="/blog" className={styles.clearFilterLink}>Clear Filter</Link>
        )}
        <br />

      {posts.length === 0 ? (
          <p className={styles.noPosts}>No blog posts {tag ? `found for the tag "${decodeURIComponent(tag)}"` : 'yet'}.</p>
        ) : (
          // Remove ref/handler from Masonry
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid}
            columnClassName={styles.myMasonryGridColumn}
          >
            {/* Render cards using div */}
            {posts.map((post) => (
              <div
                key={post.slug}
                className={`${styles.postCard}`} // Apply card style
                onClick={() => handleCardClick(post.slug)} // Click handler
                style={{ cursor: 'pointer' }} // Cursor
              >
                <div className={styles.cardContent}>
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={`Featured image for ${post.title}`}
                      className={styles.postCardImage}
                      loading="lazy"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <Link to={`/blog/${post.slug}`} onClick={(e) => e.stopPropagation()} className={styles.postTitleLink}>
                     <h3 className={styles.postTitle}>{post.title}</h3>
                  </Link>
                  <time dateTime={post.date.toISOString()} className={styles.postDate}>
                    {post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.tagsContainer}>
                      {post.tags.map(tag => (
                        <Link
                          key={tag}
                          to={`/blog/tag/${encodeURIComponent(tag)}`}
                          className={styles.tagItem}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </section>
  );
};

export default BlogList;