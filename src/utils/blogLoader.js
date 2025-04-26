// import matter from 'gray-matter'; // No longer needed here

/**
 * Loads all blog post metadata from the src/content/blog directory,
 * parses JSON, and sorts them by date descending.
 */
export function loadBlogPosts() {
  console.log('[blogLoader] Starting loadBlogPosts (JSON mode)...');
  const modules = import.meta.glob('../content/blog/*.json', { 
    eager: true, 
    // as: 'raw' // No longer need raw, Vite parses JSON by default
  });
  console.log('[blogLoader] Found modules:', modules);

  const posts = Object.entries(modules).map(([filepath, jsonData]) => {
    console.log(`[blogLoader] Processing file: ${filepath}`);
    try {
      // jsonData is already parsed by Vite
      const postData = jsonData.default ? jsonData.default : jsonData;

      // Basic validation
      if (!postData || !postData.slug || !postData.title || !postData.date) {
        console.warn(`[blogLoader] Missing or incomplete data in ${filepath}`, postData);
        return null;
      }
      console.log(`[blogLoader] Loaded data for ${postData.slug}:`, postData);

      return {
        slug: postData.slug,
        title: postData.title,
        date: new Date(postData.date), // Convert date string to Date object
        // tags: postData.tags || [], // Pass tags through if needed later
      };
    } catch (parseError) {
      console.error(`[blogLoader] Error processing JSON for ${filepath}:`, parseError);
      return null;
    }
  }).filter(post => post !== null);

  posts.sort((a, b) => b.date - a.date);
  console.log('[blogLoader] Finished loading posts (JSON mode):', posts);
  return posts;
}

/**
 * Loads a single blog post (JSON data) by its slug.
 */
export async function loadBlogPost(slug) {
  try {
    console.log(`[blogLoader] Loading single post (JSON): ${slug}`);
    // Dynamically import the specific JSON file
    const postJsonModule = await import(/* @vite-ignore */ `../content/blog/${slug}.json`);
    const postData = postJsonModule.default;

    // Basic validation - Check for htmlContent now
    if (!postData || !postData.title || !postData.date || !postData.htmlContent) {
      console.warn(`Missing or incomplete data (inc. htmlContent) in ${slug}.json`, postData);
      return null;
    }

    return {
      title: postData.title,
      date: new Date(postData.date),
      htmlContent: postData.htmlContent, // Use HTML content
      // tags: postData.tags || [], // Pass tags through
    };
  } catch (error) {
    console.error(`[blogLoader] Error loading blog post ${slug}.json:`, error);
    return null; // Post not found or error loading
  }
} 