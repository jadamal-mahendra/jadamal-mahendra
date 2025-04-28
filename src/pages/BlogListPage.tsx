import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { loadBlogPosts, BlogPostListItem } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from '../styles/Blog.module.css';
import useGlowEffect from '../hooks/useGlowEffect';

const BlogListPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const cardContainerRef = useRef<HTMLElement>(null);
  useGlowEffect(cardContainerRef, '.glow-card', loading);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const allPosts = await loadBlogPosts();
        setPosts(allPosts);
      } catch (err) {
        console.error("Error loading blog posts:", err);
        setError("Failed to load posts. Please try again later.");
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!tag) {
      return posts;
    }
    return posts.filter(post => post.tags && post.tags.includes(tag));
  }, [posts, tag]);

  const pageTitle = tag ? `Posts tagged: "${decodeURIComponent(tag)}" - Blog` : "Blog - Jadamal Mahendra";
  const pageDescription = tag ? `Blog posts by Jadamal Mahendra tagged with ${decodeURIComponent(tag)}.` : "Read blog posts by Jadamal Mahendra on software development, React, Node.js, Web3, and more.";
  const headingTitle = tag ? `Tag: ${decodeURIComponent(tag)}` : "Blog";
  const subtitle = tag ? `${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''} found` : "Thoughts & Insights";

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const handleCardClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (loading) {
    return <div className={styles.centeredMessage}>Loading posts...</div>;
  }

  if (error) {
    return <div className={`${styles.centeredMessage} ${styles.error}`}>Error: {error}</div>;
  }

  return (
    <section ref={cardContainerRef} id="blog-list" className={`${styles.blogSection} section-padding`}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <div className="container">
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

        {filteredPosts.length === 0 ? (
          <p className={styles.noPosts}>No blog posts {tag ? `found for the tag "${decodeURIComponent(tag)}"` : 'yet'}.</p>
        ) : (
          <div>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              {filteredPosts.map((post: BlogPostListItem) => (
                <div
                  key={post.slug}
                  className={`${styles.postCard} glow-card`}
                  onClick={() => handleCardClick(post.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(post.slug);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardContent}>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      onClick={(e) => e.stopPropagation()}
                      className={styles.postTitleLink}
                    >
                       <h3 className={styles.postTitle}>{post.title}</h3>
                    </Link>
                    <time dateTime={post.date.toISOString()} className={styles.postDate}>
                      {post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    {post.description && <p className={styles.postDescription}>{post.description}</p>}
                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.tagsContainer}>
                        {post.tags.map((tag: string) => (
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
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListPage;