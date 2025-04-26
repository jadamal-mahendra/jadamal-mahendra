import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Masonry from 'react-masonry-css'; // Import Masonry
import { loadBlogPosts } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css'; // Create this CSS module
import Navbar from '../Layouts/Navbar';

const BlogList = () => {
  const { tag } = useParams(); // Get the tag from URL parameters
  const allPosts = loadBlogPosts(); 

  // Filter posts if a tag is present in the URL
  const posts = tag 
    ? allPosts.filter(post => post.tags && post.tags.includes(decodeURIComponent(tag)))
    : allPosts;

  const pageTitle = tag ? `Posts tagged: "${decodeURIComponent(tag)}" - Blog` : "Blog - Jadamal Mahendra";
  const pageDescription = tag ? `Blog posts by Jadamal Mahendra tagged with ${decodeURIComponent(tag)}.` : "Read blog posts by Jadamal Mahendra on software development, React, Node.js, Web3, and more.";
  const headingTitle = tag ? `Tag: ${decodeURIComponent(tag)}` : "Blog";
  const subtitle = tag ? `${posts.length} post${posts.length !== 1 ? 's' : ''} found` : "Thoughts & Insights";

  // Breakpoint configuration for Masonry
  const breakpointColumnsObj = {
    default: 3, // Default number of columns
    1100: 2,    // 2 columns for screens >= 1100px wide
    700: 1     // 1 column for screens >= 700px wide
  };

  return (
    <section id="blog-list" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <div className="container">
        <Navbar /> {/* Navbar is here */}
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
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid} // Custom class for the grid
            columnClassName={styles.myMasonryGridColumn} // Custom class for columns
          >
            {posts.map((post, index) => (
              <Link 
                key={post.slug} 
                to={`/blog/${post.slug}`} 
                className={styles.postCard}
              >
                <div className={styles.cardContent}> 
                  {/* Add image if it exists */}
                  {post.featuredImage && (
                    <img 
                      src={post.featuredImage}
                      alt={`Featured image for ${post.title}`}
                      className={styles.postCardImage} // Add a CSS class for styling
                      loading="lazy" // Lazy load images
                    />
                  )}
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <time dateTime={post.date.toISOString()} className={styles.postDate}>
                    {post.date.toLocaleDateString('en-US', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </time>
                  {/* Display Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.tagsContainer}>
                      {post.tags.map(tag => (
                        <Link 
                          key={tag} 
                          to={`/blog/tag/${encodeURIComponent(tag)}`} 
                          className={styles.tagItem}
                          onClick={(e) => e.stopPropagation()} // Prevent card link navigation when clicking tag
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </Masonry>
        )}
      </div>
    </section>
  );
};

export default BlogList; 