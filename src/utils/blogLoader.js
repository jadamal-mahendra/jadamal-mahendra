const isDevelopment = import.meta.env.DEV;
// Remove blogJsonPath - no longer needed
// const blogJsonPath = '/blog-json'; 

/**
 * Loads all blog post metadata from the src/content/blog directory (JSON files),
 * parses them, and sorts them by date descending.
 */
export function loadBlogPosts() {
  log('Starting loadBlogPosts (JSON mode)...');
  // Use import.meta.glob to find all .json files in the blog content directory
  const modules = import.meta.glob('../content/blog/*.json', { 
    eager: true, 
    // Vite automatically parses JSON, so 'as: raw' is not needed
  });
  log('Found modules:', modules);

  const posts = Object.entries(modules).map(([filepath, moduleData]) => {
    log(`Processing file: ${filepath}`);
    try {
      // moduleData might have a .default depending on Vite version/config
      const postData = moduleData.default ? moduleData.default : moduleData;

      // Basic validation (ensure core fields exist in the JSON)
      if (!postData || !postData.slug || !postData.title || !postData.date) {
        console.warn(`[blogLoader] Missing or incomplete data in ${filepath}`, postData);
        return null;
      }
      log(`Loaded metadata for ${postData.slug}:`, { slug: postData.slug, title: postData.title, date: postData.date });

      // Return necessary metadata for the list view
      return {
        slug: postData.slug,
        title: postData.title,
        date: new Date(postData.date),
        featuredImage: postData.featuredImage || null,
        tags: postData.tags || [],
      };
    } catch (parseError) {
      console.error(`[blogLoader] Error processing JSON module for ${filepath}:`, parseError);
      return null;
    }
  }).filter(post => post !== null); // Filter out any null entries from errors

  // Sort posts by date, most recent first
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  log('Finished loading posts (JSON mode):', posts);
  return posts;
}

const log = (...args) => {
  if (isDevelopment) {
    console.log('[blogLoader]', ...args);
  }
};

/**
 * Loads a single blog post (JSON data) by its slug directly from src/content/blog.
 */
export const loadBlogPost = async (slug) => {
  log(`Loading single post (JSON): ${slug}`);
  try {
    // Dynamically import the specific JSON file from the content directory
    // The /* @vite-ignore */ comment might be needed if Vite warns about the dynamic path
    const postJsonModule = await import(/* @vite-ignore */ `../content/blog/${slug}.json`);
    
    // Access the default export which contains the parsed JSON data
    const postData = postJsonModule.default;

    // Basic validation
    if (!postData || !postData.title || !postData.date || !postData.content) { // Check for 'content' now
      console.warn(`[blogLoader] Missing or incomplete data in ${slug}.json`, postData);
      throw new Error(`Incomplete data for post: ${slug}`);
    }
    log(`Successfully loaded data for ${slug}.json`);

    // Return the full post data, ensuring the date is a Date object
    return {
      ...postData, // Spread all properties from the JSON
      date: new Date(postData.date), // Ensure date is a Date object
    };
  } catch (error) {
    console.error(`[blogLoader] Error loading blog post ${slug}.json:`, error);
    // Rethrow or return null/error indicator based on how calling component handles errors
    return null; // Indicate failure to load
  }
}; 