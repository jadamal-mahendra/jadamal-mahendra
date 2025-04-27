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
        // Generate description: remove MD headings, HTML tags, collapse whitespace, then slice
        description: (postData.content || '')
          .replace(/^#+\s+.*/gm, '') // Remove Markdown headings
          .replace(/<[^>]*>/g, '')    // Remove HTML tags
          .replace(/\s+/g, ' ')       // Collapse whitespace
          .trim()                     // Trim leading/trailing space
          .slice(0, 200) || '',     // Slice to 200 chars
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
 * Loads a single blog post (JSON data) by its slug using dynamic import.meta.glob.
 */
export const loadBlogPost = async (slug) => {
  log(`Loading single post (JSON via dynamic glob): ${slug}`);
  
  // Define the glob pattern for dynamic loading
  // Returns an object where keys are paths and values are async functions to load the module
  const modules = import.meta.glob('../content/blog/*.json');
  const targetPath = `../content/blog/${slug}.json`;

  log(`Looking for module: ${targetPath}`);

  // Check if the module loader function exists for the target path
  if (!modules[targetPath]) {
    console.error(`[blogLoader] Module not found for path: ${targetPath}`);
    return null; // Module doesn't exist
  }

  try {
    // Dynamically load the module using the function provided by glob
    const moduleLoader = modules[targetPath];
    const postJsonModule = await moduleLoader(); // Execute the loader function
    
    // Access the default export which contains the parsed JSON data
    const postData = postJsonModule.default;

    // Basic validation
    if (!postData || !postData.title || !postData.date || !postData.content) { 
      console.warn(`[blogLoader] Missing or incomplete data in ${slug}.json`, postData);
      throw new Error(`Incomplete data for post: ${slug}`);
    }
    log(`Successfully loaded module and data for ${slug}.json`);

    // Return the full post data, ensuring the date is a Date object
    return {
      ...postData,
      date: new Date(postData.date),
    };
  } catch (error) {
    console.error(`[blogLoader] Error dynamically loading blog post ${slug}.json:`, error);
    return null; // Indicate failure to load
  }
}; 