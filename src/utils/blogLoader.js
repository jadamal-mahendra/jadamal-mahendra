import matter from 'gray-matter';

/**
 * Loads all blog posts from the src/content/blog directory,
 * parses frontmatter, and sorts them by date descending.
 */
export function loadBlogPosts() {
  const modules = import.meta.glob('../content/blog/*.md', { 
    eager: true, // Load modules immediately
    as: 'raw' // Import as raw string content
  });

  const posts = Object.entries(modules).map(([filepath, content]) => {
    const { data: frontmatter } = matter(content);
    const slug = filepath.split('/').pop().replace('.md', '');
    
    // Basic validation
    if (!frontmatter.title || !frontmatter.date) {
      console.warn(`Missing frontmatter in ${filepath}`);
      return null;
    }

    return {
      slug,
      title: frontmatter.title,
      date: new Date(frontmatter.date), // Convert date string to Date object
    };
  }).filter(post => post !== null); // Filter out posts with missing frontmatter

  // Sort posts by date, newest first
  posts.sort((a, b) => b.date - a.date);

  return posts;
}

/**
 * Loads a single blog post by its slug.
 */
export async function loadBlogPost(slug) {
  try {
    // Dynamically import the specific markdown file as raw text
    const rawContent = await import(/* @vite-ignore */ `../content/blog/${slug}.md?raw`);
    const { data: frontmatter, content: body } = matter(rawContent.default);

    // Basic validation
    if (!frontmatter.title || !frontmatter.date) {
      console.warn(`Missing frontmatter in ${slug}.md`);
      return null;
    }

    return {
      title: frontmatter.title,
      date: new Date(frontmatter.date),
      content: body,
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null; // Post not found or error loading
  }
} 