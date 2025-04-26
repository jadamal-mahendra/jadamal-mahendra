import React from 'react';
import { Link } from 'react-router-dom';
import { loadBlogPosts } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css'; // Create this CSS module
import Navbar from '../Layouts/Navbar';

const BlogList = () => {
  const posts = loadBlogPosts();

  return (
    <section id="blog-list" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>Blog - Jadamal Mahendra</title>
        <meta name="description" content="Read blog posts by Jadamal Mahendra on software development, React, Node.js, Web3, and more." />
      </Helmet>
      <div className="container">
        <Navbar />
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
          <ul className={styles.postList} data-aos="fade-up" data-aos-delay="100">
            {posts.map((post) => (
              <li key={post.slug} className={styles.postListItem}>
                <Link to={`/blog/${post.slug}`} className={styles.postLink}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <time dateTime={post.date.toISOString()} className={styles.postDate}>
                    {post.date.toLocaleDateString('en-US', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default BlogList; 