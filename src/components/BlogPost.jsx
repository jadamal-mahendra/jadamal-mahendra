import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { loadBlogPost } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css'; // Reuse or create specific styles
import Navbar from '../Layouts/Navbar';

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
    // Optionally redirect or show a better 404 message
    // navigate('/404'); 
    return <div className={styles.error}>Post not found.</div>;
  }

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
            <h1 className={styles.postTitleArticle}>{post.title}</h1>
            <time dateTime={post.date.toISOString()} className={styles.postDateArticle}>
              {post.date.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </time>
          </header>
          
          <div className={styles.postContent}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
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