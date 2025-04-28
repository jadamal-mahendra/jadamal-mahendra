const isDevelopment = import.meta.env.DEV;
// Remove blogJsonPath - no longer needed
// const blogJsonPath = '/blog-json'; 

// TODO: Define proper interfaces for PostData and ModuleData

interface PostData {
  slug: string;
  title: string;
  date: string; // Initially string, converted to Date later
  featuredImage?: string | null;
  tags?: string[];
  content?: string; // Present in single post view, optional in list view generation
  description?: string; // Might be generated or present
}

interface ModuleData {
  default?: PostData;
  // Allow direct access if default is not present
  [key: string]: any; 
}

interface BlogPostListItem {
  slug: string;
  title: string;
  date: Date;
  featuredImage: string | null;
  tags: string[];
  description: string;
}

// Redefine BlogPost - Combine PostData fields (minus date string) with date as Date
interface BlogPost {
    slug: string;
    title: string;
    date: Date; // Date object
    featuredImage?: string | null;
    tags?: string[];
    content: string; // Content is required for a single post
    description?: string; // Still optional
}

/**
 * Loads all blog post metadata from the src/content/blog directory (JSON files),
 * parses them, and sorts them by date descending.
 */
export function loadBlogPosts(): BlogPostListItem[] {
  log('Starting loadBlogPosts (JSON mode)...');
  
  // Explicitly type the imported modules
  // Use as any for import.meta.glob which might not be fully typed by vite/client yet
  const modules: Record<string, ModuleData> = (import.meta.glob as any)('../content/blog/*.json', { 
    eager: true, 
  });
  log('Found modules:', modules);

  const posts: BlogPostListItem[] = Object.entries(modules).map(([filepath, moduleData]) => {
    log(`Processing file: ${filepath}`);
    try {
      // Cast moduleData directly if default isn't guaranteed structure
      const postData: PostData | undefined = moduleData.default ?? (moduleData as PostData);

      if (!postData || !postData.slug || !postData.title || !postData.date) {
        console.warn(`[blogLoader] Missing or incomplete data in ${filepath}`, postData);
        return null;
      }
      log(`Loaded metadata for ${postData.slug}:`, { slug: postData.slug, title: postData.title, date: postData.date });

      const description = (postData.content || '')
        .replace(/^#+\s+.*/gm, '') 
        .replace(/<[^>]*>/g, '')    
        .replace(/\s+/g, ' ')       
        .trim()                     
        .slice(0, 200) || '';

      return {
        slug: postData.slug,
        title: postData.title,
        date: new Date(postData.date), // Convert to Date object
        featuredImage: postData.featuredImage || null,
        tags: postData.tags || [],
        description: description,
      };
    } catch (parseError) {
      console.error(`[blogLoader] Error processing JSON module for ${filepath}:`, parseError);
      return null;
    }
  })
  .filter((post): post is BlogPostListItem => post !== null); // Type guard for filtering nulls

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  log('Finished loading posts (JSON mode):', posts);
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
  
  // Type the dynamic import result
  // Use as any for import.meta.glob which might not be fully typed by vite/client yet
  const modules: Record<string, () => Promise<ModuleData>> = (import.meta.glob as any)('../content/blog/*.json');
  const targetPath = `../content/blog/${slug}.json`; // Keep relative path for dynamic import key

  log(`Looking for module: ${targetPath}`);

  const moduleLoader = modules[targetPath];
  if (!moduleLoader) {
    console.error(`[blogLoader] Module not found for path: ${targetPath}`);
    return null;
  }

  try {
    const postJsonModule = await moduleLoader();
    // Cast moduleData directly if default isn't guaranteed structure
    const postData: PostData | undefined = postJsonModule.default ?? (postJsonModule as PostData);

    if (!postData || !postData.title || !postData.date || !postData.content) { 
      console.warn(`[blogLoader] Missing or incomplete data in ${slug}.json`, postData);
      throw new Error(`Incomplete data for post: ${slug}`);
    }
    log(`Successfully loaded module and data for ${slug}.json`);

    // Construct the final BlogPost object with the correct type
    const finalPost: BlogPost = {
      slug: postData.slug || slug,
      title: postData.title,
      date: new Date(postData.date), // Convert to Date object
      featuredImage: postData.featuredImage || null,
      tags: postData.tags || [],
      content: postData.content, // Content is required here
      description: postData.description // Keep if present
    };
    return finalPost;

  } catch (error) {
    console.error(`[blogLoader] Error dynamically loading blog post ${slug}.json:`, error);
    return null;
  }
}; 