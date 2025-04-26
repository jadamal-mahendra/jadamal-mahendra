import matter from 'gray-matter';

/**
 * Loads all blog posts from the src/content/blog directory,
 * parses frontmatter, and sorts them by date descending.
 */
export function loadBlogPosts() {
  console.log('[blogLoader] Starting loadBlogPosts...');
  const modules = import.meta.glob('../content/blog/*.md', { 
    eager: true, // Load modules immediately
    as: 'raw' // Import as raw string content
  });
  console.log('[blogLoader] Found modules:', modules);

  const posts = Object.entries(modules).map(([filepath, content]) => {
    console.log(`[blogLoader] Processing file: ${filepath}`);
    try {
      const { data: frontmatter } = matter(content);
      const slug = filepath.split('/').pop().replace('.md', '');
      
      // Basic validation
      if (!frontmatter || !frontmatter.title || !frontmatter.date) {
        console.warn(`[blogLoader] Missing or incomplete frontmatter in ${filepath}`, frontmatter);
        return null;
      }
      console.log(`[blogLoader] Parsed frontmatter for ${slug}:`, frontmatter);

      return {
        slug,
        title: frontmatter.title,
        date: new Date(frontmatter.date), // Convert date string to Date object
      };
    } catch (parseError) {
      console.error(`[blogLoader] Error parsing frontmatter for ${filepath}:`, parseError);
      return null;
    }
  }).filter(post => post !== null); // Filter out posts with missing frontmatter or parse errors

  // Sort posts by date, newest first
  posts.sort((a, b) => b.date - a.date);
  console.log('[blogLoader] Finished loading posts:', posts);

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