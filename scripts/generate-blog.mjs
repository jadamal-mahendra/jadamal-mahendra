import fs from 'fs/promises';
import fsCallbacks from 'fs'; // Import callback-based fs for createWriteStream
import path from 'path';
import { fileURLToPath } from 'url'; // Import url utility
import dotenv from 'dotenv';
import OpenAI from 'openai';
import matter from 'gray-matter'; // Import gray-matter
import https from 'https'; // Needed for image download potentially
import stream from 'stream';
import { promisify } from 'util';

// Load environment variables from .env file
dotenv.config();

// Get current directory path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openaiApiKey = process.env.OPENAI_API_KEY;
const blogContentDir = path.resolve(__dirname, '../src/content/blog'); // Use path.resolve for robustness
const blogImageDir = path.resolve(__dirname, '../public/assets/blog-images'); // Save images to public directory

const pipeline = promisify(stream.pipeline);

if (!openaiApiKey) {
  console.error('Error: OPENAI_API_KEY is not set in the .env file.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

async function generateBlogPost() {
  console.log('Starting blog post generation...');

  // 1. Define skills/topics (Read from Content.js or define manually)
  //    TODO: Implement reading skills from '../src/Content.js'
  //    For now, let's use a hardcoded list based on Content.js
  const skills = [
    "React js", "Node js", "GraphQL", "Material UI", "TypeScript",
    "Next Js", "Web3 / Blockchain", "Solidity", "Databases", "MongoDB",
    "Microfrontends", "Git", "Mobile App Development (React Native)",
    "Backend & API Development", "Frontend Development"
  ];
  console.log('Using skills:', skills);

  // 2. Get existing blog post topics to avoid duplication
  let existingTopics = []; // Changed from const to let
  try {
    const files = await fs.readdir(blogContentDir);
    console.log(`[generate-blog] Found ${files.length} potential post files in ${blogContentDir}.`);
    
    for (const filename of files) {
      if (path.extname(filename) === '.json') { // Process only JSON files
        const filePath = path.join(blogContentDir, filename);
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const postData = JSON.parse(fileContent);
          if (postData && postData.title) {
            existingTopics.push(postData.title); // Add title to the list
          }
        } catch (readOrParseError) {
          console.warn(`[generate-blog] Warning: Could not read or parse ${filename}:`, readOrParseError.message);
          // Optionally skip this file or handle error differently
        }
      }
    }

  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('[generate-blog] Blog content directory does not exist. Creating...');
      await fs.mkdir(blogContentDir, { recursive: true });
    } else {
      console.error('[generate-blog] Error reading blog directory:', err);
      // Decide if we should proceed or exit
    }
  }
  console.log('[generate-blog] Existing topics found:', existingTopics); // Updated log

  // 3. Select a topic/skill for the new post
  //    TODO: Implement better logic to choose a skill, e.g., one not recently covered
  const selectedSkill = skills[Math.floor(Math.random() * skills.length)]; // Simple random selection for now
  console.log(`Selected skill for new post: ${selectedSkill}`);

  // 4. Construct the prompt for OpenAI
  const prompt = `
    You are an expert software development blogger writing for a professional portfolio website. Your target audience is fellow experienced software developers (mid-level to senior).
    
    Write an insightful blog post (approx. 500-800 words) focusing on the skill: "${selectedSkill}".
    
    Go beyond a basic introduction. Discuss nuances, trade-offs, common pitfalls, advanced use cases, architectural considerations, or best practices relevant to experienced engineers using this skill.
    
    Where appropriate, include realistic and illustrative code examples using Markdown code fences (e.g., \`\`\`typescript ... \`\`\`). Explain the code clearly.
    
    The tone should be authoritative, insightful, and professional, reflecting deep experience.
    
    Create an engaging title that is more specific than just "${selectedSkill}".
    
    Format the output strictly as Markdown, including YAML frontmatter at the beginning with 'title', 'date' (YYYY-MM-DD format), 'tags' (a YAML array of relevant keywords, including the core skill and related concepts), and 'imagePrompt' (a short English phrase describing a suitable conceptual or abstract featured image for this advanced topic, e.g., 'Abstract representation of interconnected system architecture').

    Example frontmatter format:
    ---
    title: "Navigating Asynchronous Patterns in Production Node.js"
    date: today date in this format"2024-01-15"
    tags:
      - Node.js
      - JavaScript
      - Async
      - Promises
      - Event Loop
      - Performance
    imagePrompt: "Complex network of interconnected glowing nodes"
    ---

    Existing blog post topics to try and avoid repeating directly: ${existingTopics.join(', ') || 'None'}
  `;

  // 5. Call OpenAI API
  console.log('Generating content with OpenAI...');
  let generatedMarkdown = '';
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or a newer model if you prefer
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // Adjust for creativity vs consistency
    });
    generatedMarkdown = completion.choices[0].message?.content?.trim() || '';
    console.log('Content generated successfully.');
    console.log('--- Raw Generated Content ---');
    console.log(generatedMarkdown);
    console.log('---------------------------');

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return; // Exit if generation fails
  }

  let postData = {};
  let slug = '';
  let postTitle = '';
  let frontmatter = {}; // Define frontmatter in the outer scope

  // ---> Get and format the current date <---
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;
  // ---> End date formatting <---

  try {
    // Parse frontmatter and content directly
    const { data, content: contentBody } = matter(generatedMarkdown);
    frontmatter = data; // Assign the parsed data to the outer scope variable

    // ---> OVERWRITE the date from AI with the current date <---
    frontmatter.date = currentDate;
    // ---> End date overwrite <---

    // Validate frontmatter - Now include imagePrompt
    if (!frontmatter || !frontmatter.title || !frontmatter.date || !frontmatter.imagePrompt) { // Date check is still good
      throw new Error('Generated content missing required frontmatter (title, date, imagePrompt).');
    }
    console.log('[generate-blog] Parsed Frontmatter (Date Overwritten):', frontmatter);

    postTitle = frontmatter.title.trim();
    slug = postTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    postData = {
        slug: slug,
        title: postTitle,
        date: frontmatter.date, // This will now use the correct current date
        tags: frontmatter.tags || [],
        content: contentBody.trim(), // Store raw Markdown content again
        featuredImage: null // Keep placeholder
    };
    console.log(`[generate-blog] Prepared JSON data for ${slug}.json (with raw Markdown)`);

  } catch (error) {
      console.error('[generate-blog] Error processing generated Markdown:', error);
      return;
  }

  // --- Step 5b: Generate and Save Image --- 
  if (frontmatter && frontmatter.imagePrompt) { // Add a check for frontmatter existence too
    console.log(`[generate-blog] Generating image with prompt: "${frontmatter.imagePrompt}"`);
    try {
      const response = await openai.images.generate({
        model: "dall-e-2", // Or dall-e-3 if preferred/available
        prompt: frontmatter.imagePrompt,
        n: 1, // Generate one image
        size: "1024x1024" // Or other supported size
      });
      
      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL received from OpenAI.');
      }
      console.log(`[generate-blog] Image generated: ${imageUrl}`);

      // Download and save the image
      const imageFilename = `${slug}.png`; // Assuming PNG, adjust if needed
      const imageSavePath = path.join(blogImageDir, imageFilename);
      const relativeImagePath = `/assets/blog-images/${imageFilename}`; // Path for frontend

      console.log(`[generate-blog] Downloading image to ${imageSavePath}...`);
      await fs.mkdir(blogImageDir, { recursive: true }); // Ensure directory exists
      
      // Use fetch to get the image stream
      const fetchResponse = await fetch(imageUrl);
      if (!fetchResponse.ok) {
        throw new Error(`Failed to download image: ${fetchResponse.statusText}`);
      }
      if (!fetchResponse.body) {
        throw new Error('Response body is null');
      }

      // Stream the image to the file using callback fs
      await pipeline(fetchResponse.body, fsCallbacks.createWriteStream(imageSavePath));

      console.log(`[generate-blog] Image saved successfully to ${imageSavePath}`);
      postData.featuredImage = relativeImagePath; // Update post data with relative path

    } catch (imgError) {
      console.error('[generate-blog] Error generating or saving image:', imgError.message);
      postData.featuredImage = null; // Ensure featuredImage is null if image fails
    }
  } else {
    console.log('[generate-blog] No image prompt found or frontmatter missing, skipping image generation.');
    postData.featuredImage = null;
  }
  // --- End Image Generation --- 

  // --- Save JSON --- 
  const filename = `${postData.slug}.json`;
  const filePath = path.join(blogContentDir, filename);
  console.log(`[generate-blog] Saving JSON to: ${filename}`);

  try {
    await fs.writeFile(filePath, JSON.stringify(postData, null, 2)); // Write JSON
    console.log(`Successfully wrote blog post JSON to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}


 generateBlogPost(); 
