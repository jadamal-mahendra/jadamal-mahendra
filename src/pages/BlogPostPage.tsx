import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { loadBlogPost, BlogPost } from '@/utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from '@/styles/Blog.module.css';
import { FaLinkedin } from 'react-icons/fa';
import CodeBlock from '@/components/CodeBlock/CodeBlock';

const BlogPostPage = () => {
  // Define helper function INSIDE the component
  const cleanDescription = (text = '', maxLength = 160) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\r\n|\n|\r/gm, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/^#+\s+.*/gm, '') // Remove markdown headings
      .trim()
      .slice(0, maxLength);
  };

  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // --- Base URL from environment variable --- (Keep this)
  const publicSiteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, ''); 

  useEffect(() => {
    // Set the full canonical URL client-side (Keep this)
    setCurrentUrl(window.location.href);

    const fetchPost = async () => {
      // Ensure slug exists before fetching
      if (!slug) { 
        console.error("No slug provided in URL");
        setError(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(false);
      const loadedPost = await loadBlogPost(slug);
      if (loadedPost) {
        setPost(loadedPost); // This assignment is now type-safe
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className={styles.loading}>Loading post...</div>;
  }

  if (error || !post) {
    console.error('BlogPost Error: Post not found or error loading.', { error, post });
    return <div className={styles.error}>Post not found.</div>;
  }

  console.log('Rendering BlogPost with post data:', post);

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  // --- Prepare SEO data --- (Keep this)
  const pageTitle = `${post.title} - Jadamal Mahendra Blog`;
  const metaDescription = cleanDescription(post.content, 160); 
  const ogDescription = cleanDescription(post.content, 300); 
  const canonicalUrl = currentUrl || `${publicSiteUrl}/blog/${post.slug}`;
  
  // --- Robust Image URL Construction --- (Keep this)
  let featuredImageUrl = `${publicSiteUrl}/assets/default-og-image.png`; 
  if (post.featuredImage) {
    if (post.featuredImage.startsWith('http')) {
        featuredImageUrl = post.featuredImage;
    } else {
        try {
            featuredImageUrl = new URL(post.featuredImage, publicSiteUrl).href;
        } catch (e) {
            console.error(`Error constructing featured image URL from path: ${post.featuredImage}`, e);
        }
    }
  }
  // --- End Robust Image URL Construction ---

  const authorName = "Jadamal Mahendra"; 

  return (
    <section id="blog-post" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content={authorName} />
        {post.tags && post.tags.length > 0 && (
            <meta name="keywords" content={post.tags.join(', ')} />
        )}

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Jadamal Mahendra Blog" /> 
        <meta property="og:locale" content="en_US" /> 
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date.toISOString()} />
        <meta property="article:author" content={authorName} />
        {post.tags && post.tags.map(tag => (
            <meta property="article:tag" content={tag} key={`og:tag:${tag}`} />
        ))}

        <meta property="og:image" content={featuredImageUrl} />
        <meta property="og:image:width" content="1200" /> 
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.featuredImageAlt || post.title} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={featuredImageUrl} />
        <meta name="twitter:image:alt" content={post.featuredImageAlt || post.title} />
      </Helmet>
      <div className="container">
        <article className={styles.postArticle}>
          <header className={styles.postHeader}>
            <h1 className={styles.postTitleArticle}>{post.title}</h1>
            <time dateTime={post.date.toISOString()} className={styles.postDateArticle}>
              {post.date.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
            {post.tags && post.tags.length > 0 && (
              <div className={styles.tagsContainer}>
                {post.tags.map((tag: string) => (
                  <Link to={`/blog/tag/${encodeURIComponent(tag)}`} key={tag} className={styles.tagItem}>{tag}</Link>
                ))}
              </div>
            )}
          </header>
          
          <div className={styles.postContent}>
             <ReactMarkdown
               components={{
                 code: CodeBlock,
                 h1: () => null, 
               }}
             >
               {post.content} 
             </ReactMarkdown>
          </div>

          <footer className={styles.postFooter}>
            <Link to="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
            <a 
              href={linkedInShareUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.shareLink}
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

export default BlogPostPage; 