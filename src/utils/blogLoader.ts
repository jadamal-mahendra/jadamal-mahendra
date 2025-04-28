const isDevelopment = import.meta.env.DEV;
// Remove blogJsonPath - no longer needed
// const blogJsonPath = '/blog-json'; 

// TODO: Define proper interfaces for PostData and ModuleData

interface PostData {
  slug: string;
  title: string;
  date: string; // Initially string, converted to Date later
  featuredImage?: string | null;
  featuredImageAlt?: string; // Add optional alt text field here too
  tags?: string[];
  content?: string; // Present in single post view, optional in list view generation
  description?: string; // Might be generated or present
}

// Export this interface too
export interface BlogPostListItem {
  slug: string;
  title: string;
  date: Date;
  featuredImage: string | null;
  tags: string[];
  description: string;
}

// Redefine BlogPost - Combine PostData fields (minus date string) with date as Date
export interface BlogPost {
    slug: string;
    title: string;
    date: Date; // Date object
    featuredImage?: string | null;
    featuredImageAlt?: string; // Keep optional alt text field
    tags?: string[];
    content: string; // Content is required for a single post
    description?: string; // Still optional
}

// Define types for the dynamic import results
// This assumes the default export of your JSON is PostData
// and allows for other potential exports if needed.
type JsonModule = { default: PostData } & Record<string, unknown>; 
type DynamicImportResult = Record<string, () => Promise<JsonModule>>;

/**
 * Loads all blog post metadata from the src/content/blog directory (JSON files),
 * parses them, and sorts them by date descending.
 */
export async function loadBlogPosts(): Promise<BlogPostListItem[]> {
  log('Starting loadBlogPosts (JSON mode - async)...');

  const modules = import.meta.glob('../content/blog/*.json') as DynamicImportResult;
  log('Found module loaders:', Object.keys(modules));

  // Use Promise.allSettled for better error handling if one load fails
  const postResults = await Promise.allSettled(
    Object.entries(modules).map(async ([filepath, moduleLoader]: [string, () => Promise<JsonModule>]) => {
      log(`Attempting to load module: ${filepath}`);
      try {
        const moduleData = await moduleLoader(); 
        const postData: PostData | undefined = moduleData.default;

        if (!postData || !postData.slug || !postData.title || !postData.date) {
          throw new Error(`Missing or incomplete data in ${filepath}`);
        }

        const description = (postData.content || '')
          .replace(/^#+\s+.*/gm, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 200) || '';

        return {
          slug: postData.slug,
          title: postData.title,
          date: new Date(postData.date),
          featuredImage: postData.featuredImage || null,
          tags: postData.tags || [],
          description: description,
        };
      } catch (loadError: unknown) {
        // Type check before accessing properties
        const errorMessage = loadError instanceof Error ? loadError.message : String(loadError);
        console.error(`[blogLoader] Error processing JSON module for ${filepath}:`, errorMessage);
        throw loadError; 
      }
    })
  );

  // Filter successful results and log rejections
  const posts: BlogPostListItem[] = [];
  postResults.forEach(result => {
    if (result.status === 'fulfilled') {
      posts.push(result.value);
    } else {
      // Log rejected promises (errors during load/processing)
      // Error was already logged in the catch block, 
      // but you could add more context here if needed.
    }
  });

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  log('Finished loading posts (JSON mode - async):', posts);
  return posts;
}

// Define type for log arguments
const log = (...args: any[]) => {
  if (isDevelopment) {
    console.log('[blogLoader]', ...args);
  }
};

/**
 * Loads a single blog post (JSON data) by its slug using dynamic import.meta.glob.
 */
export const loadBlogPost = async (slug: string): Promise<BlogPost | null> => {
  log(`Loading single post (JSON via dynamic glob): ${slug}`);
  
  const modules = import.meta.glob('../content/blog/*.json') as DynamicImportResult;
  const targetPath = `../content/blog/${slug}.json`; 

  log(`Looking for module: ${targetPath}`);

  const moduleLoader = modules[targetPath];
  if (!moduleLoader) {
    console.error(`[blogLoader] Module not found for path: ${targetPath}`);
    return null;
  }

  try {
    const postJsonModule = await moduleLoader(); 
    const postData: PostData | undefined = postJsonModule.default;

    if (!postData || !postData.title || !postData.date || !postData.content) { 
      console.warn(`[blogLoader] Missing or incomplete data in ${slug}.json`, postData);
      throw new Error(`Incomplete data for post: ${slug}`);
    }
    log(`Successfully loaded module and data for ${slug}.json`);

    const finalPost: BlogPost = {
      slug: postData.slug || slug,
      title: postData.title,
      date: new Date(postData.date),
      featuredImage: postData.featuredImage || null,
      featuredImageAlt: postData.featuredImageAlt || postData.title, 
      tags: postData.tags || [],
      content: postData.content, 
      description: postData.description
    };
    return finalPost;

  } catch (error) {
    console.error(`[blogLoader] Error dynamically loading blog post ${slug}.json:`, error);
    return null;
  }
}; 