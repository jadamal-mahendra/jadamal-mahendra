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
import fetch from 'node-fetch'; // <--- Add import for fetch

// Load environment variables from .env file
dotenv.config();

// Get current directory path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openaiApiKey = process.env.OPENAI_API_KEY;
// ---> Add site URL and function secret from environment variables <--- 
const publicSiteUrl = process.env.PUBLIC_SITE_URL;
const functionSecret = process.env.FUNCTION_SECRET_KEY;
// ---> End environment variable loading <---

const blogContentDir = path.resolve(__dirname, '../src/content/blog'); // Use path.resolve for robustness
const blogImageDir = path.resolve(__dirname, '../public/assets/blog-images'); // Save images to public directory

const pipeline = promisify(stream.pipeline);

if (!openaiApiKey) {
  console.error('Error: OPENAI_API_KEY is not set in the .env file.');
  process.exit(1);
}

// ---> Add check for PUBLIC_SITE_URL <---
if (!publicSiteUrl) {
  console.warn('Warning: PUBLIC_SITE_URL is not set in the .env file. Cannot construct full URLs for LinkedIn posting.');
  // Decide if you want to exit or just skip posting
  // process.exit(1);
}
// ---> End check <---

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// ---> Define the triggerZapierWebhook function here <--- 
async function triggerZapierWebhook(postData, postUrl) {
  const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/22683508/2pt67cf/'; 

  console.log(`Attempting to trigger Zapier webhook: ${zapierWebhookUrl}`);

  try {
    const payload = {
      title: postData.title,
      url: postUrl, // The absolute URL to the deployed blog post
      // Generate description from content for the Zapier payload
      description: (postData.content || '')
        .replace(/^#+\s+.*/gm, '') 
        .replace(/<[^>]*>/g, '')    
        .replace(/\s+/g, ' ')       
        .trim()                     
        .slice(0, 250) || 'Read more...' // Slightly longer slice for Zapier context
    };

    // ---> Add Detailed Logging <--- 
    console.log("\n--- Debug Zapier Request ---");
    console.log("Payload Object:", payload);
    const jsonBody = JSON.stringify(payload);
    console.log("JSON Body Sent:", jsonBody);
    const headers = {
      'Content-Type': 'application/json',
    };
    console.log("Headers Sent:", headers);
    console.log("--- End Debug Zapier Request ---\n");
    // ---> End Detailed Logging <---

    const response = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: headers, // Use the logged headers object
      body: jsonBody // Use the logged JSON body string
    });

    // Zapier typically returns a success status even if the Zap fails later
    // We primarily check if the webhook itself was received ok (2xx status)
    if (!response.ok) {
      // Attempt to get error details if Zapier provides them
      let errorBody = await response.text(); 
      console.error(`Failed to trigger Zapier webhook (${response.status}):`, errorBody || response.statusText);
    } else {
      const result = await response.json(); // Zapier returns status info
      console.log('Zapier webhook triggered successfully:', result);
    }
  } catch (error) {
    console.error('Error calling Zapier webhook:', error);
  }
}
// ---> End definition of triggerZapierWebhook <---

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
    
    Format the output strictly as Markdown. 
    **IMPORTANT:** Start the response *directly* with the YAML frontmatter block, enclosed ONLY by \`---\` delimiters on their own lines. Do NOT wrap the frontmatter in \`\`\`yaml or any other code block fences. 
    The frontmatter must include 'title', 'date' (in YYYY-MM-DD format), 'tags' (a YAML array of relevant keywords), and 'imagePrompt' (a short phrase describing a suitable featured image).

    Example frontmatter format:
    ---\n    title: \"Navigating Asynchronous Patterns in Production Node.js\"\n    date: \"2024-01-15\" \n    tags:\n      - Node.js\n      - JavaScript\n      - Async\n      - Promises\n      - Event Loop\n      - Performance\n    imagePrompt: \"Complex network of interconnected glowing nodes\"\n    ---\n\n    After the closing \`---\` delimiter of the frontmatter, the main Markdown content of the blog post should follow.\n\n    Existing blog post topics to try and avoid repeating directly: ${existingTopics.join(', ')} || 'None'\n  `;

  // 5. Call OpenAI API
  console.log('Generating content with OpenAI...');
  let generatedMarkdown = '';
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Or a newer model if you prefer
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
    if (!frontmatter || !frontmatter.title || !frontmatter.date ) { // Date check is still good
      throw new Error('Generated content missing required frontmatter (title, date).');
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

 

  // --- Save JSON --- 
  const filename = `${postData.slug}.json`;
  const filePath = path.join(blogContentDir, filename);
  console.log(`[generate-blog] Saving JSON to: ${filename}`);

  try {
    await fs.writeFile(filePath, JSON.stringify(postData, null, 2)); // Write JSON
    console.log(`Successfully wrote blog post JSON to ${filePath}`);

    // ---> Call triggerZapierWebhook after successful save <---
    if (publicSiteUrl) { // Only proceed if we have the base URL
      // Construct the full URL to the new post
      const deployedUrl = `${publicSiteUrl.replace(/\/$/, '')}/blog/${postData.slug}`;
      console.log(`Constructed deployed URL: ${deployedUrl}`);
      // Call the Zapier function instead of notifyLinkedIn
      await triggerZapierWebhook(postData, deployedUrl); 
    } else {
      console.warn('Skipping Zapier notification because PUBLIC_SITE_URL is not set.');
    }
    // ---> End Zapier notification call <---

  } catch (error) {
    console.error(`Error writing file ${filePath} or notifying Zapier:`, error);
  }
}



generateBlogPost(); 
