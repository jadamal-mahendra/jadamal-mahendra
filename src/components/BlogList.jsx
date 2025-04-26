import React from 'react';
import { Link } from 'react-router-dom';
import { loadBlogPosts } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css'; // Create this CSS module
import Navbar from '../Layouts/Navbar';

const BlogList = () => {
  const posts = loadBlogPosts(); // Uncommented

  return (
    <section id="blog-list" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>Blog - Jadamal Mahendra</title>
        <meta name="description" content="Read blog posts by Jadamal Mahendra on software development, React, Node.js, Web3, and more." />
      </Helmet>
      <div className="container">
        <Navbar /> {/* Navbar is here */}
        {/* Restore original headings and post rendering logic */}
        <h2 className="section-title" data-aos="fade-up">
          Blog 
        </h2>
        <h4 className="section-subtitle" data-aos="fade-up">
          Thoughts & Insights
        </h4>
        <br />
        
        {posts.length === 0 ? (
          <p className={styles.noPosts}>No blog posts yet. Check back soon!</p>
        ) : (
          <div className={styles.postGrid}>
            {posts.map((post, index) => (
              <Link 
                key={post.slug} 
                to={`/blog/${post.slug}`} 
                className={styles.postCard}
                /* data-aos="fade-up" */ 
                /* data-aos-delay={index * 100} */ // Removed AOS attributes
              >
                <div className={styles.cardContent}> 
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <time dateTime={post.date.toISOString()} className={styles.postDate}>
                    {post.date.toLocaleDateString('en-US', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList; 