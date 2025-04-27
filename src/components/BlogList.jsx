import React, { useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { loadBlogPosts } from '../utils/blogLoader';
import { Helmet } from 'react-helmet-async';
import styles from './Blog.module.css';
import Navbar from '../Layouts/Navbar';
import useGlowEffect from '../hooks/useGlowEffect';

const BlogList = () => {
  const { tag } = useParams();
  const allPosts = loadBlogPosts();
  const navigate = useNavigate();

  const cardContainerRef = useRef(null);

  const posts = tag
    ? allPosts.filter(post => post.tags && post.tags.includes(decodeURIComponent(tag)))
    : allPosts;
console.log(posts);
  useGlowEffect(cardContainerRef, `.${styles.postCard}`);

  const pageTitle = tag ? `Posts tagged: "${decodeURIComponent(tag)}" - Blog` : "Blog - Jadamal Mahendra";
  const pageDescription = tag ? `Blog posts by Jadamal Mahendra tagged with ${decodeURIComponent(tag)}.` : "Read blog posts by Jadamal Mahendra on software development, React, Node.js, Web3, and more.";
  const headingTitle = tag ? `Tag: ${decodeURIComponent(tag)}` : "Blog";
  const subtitle = tag ? `${posts.length} post${posts.length !== 1 ? 's' : ''} found` : "Thoughts & Insights";

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const handleCardClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

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

      {posts.length === 0 ? (
          <p className={styles.noPosts}>No blog posts {tag ? `found for the tag "${decodeURIComponent(tag)}"` : 'yet'}.</p>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.myMasonryGrid}
            columnClassName={styles.myMasonryGridColumn}
          >
            {posts.map((post) => (
              <div
                key={post.slug}
                className={`${styles.postCard} glow-card`}
                onClick={() => handleCardClick(post.slug)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardContent}>
               
                  <Link to={`/blog/${post.slug}`} onClick={(e) => e.stopPropagation()} className={styles.postTitleLink}>
                     <h3 className={styles.postTitle}>{post.title}</h3>
                  </Link>
                  <time dateTime={post.date.toISOString()} className={styles.postDate}>
                    {post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {post.description && <p className={styles.postDescription}>{post.description}</p>}
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