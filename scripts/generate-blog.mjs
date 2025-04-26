import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; // Import url utility
import dotenv from 'dotenv';
import OpenAI from 'openai';
import matter from 'gray-matter'; // Import gray-matter
import { marked } from 'marked'; // Import marked

// Load environment variables from .env file
dotenv.config();

// Get current directory path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openaiApiKey = process.env.OPENAI_API_KEY;
const blogContentDir = path.resolve(__dirname, '../src/content/blog'); // Use path.resolve for robustness

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
  //    TODO: Implement reading existing post titles/topics from markdown frontmatter
  const existingTopics = []; // Placeholder
  try {
    const files = await fs.readdir(blogContentDir);
    console.log(`Found ${files.length} existing files in ${blogContentDir}.`);
    // TODO: Parse frontmatter from each file to get titles
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Blog content directory does not exist. Creating...');
      await fs.mkdir(blogContentDir, { recursive: true });
    } else {
      console.error('Error reading blog directory:', err);
      // Decide if we should proceed or exit
    }
  }
  console.log('Existing topics (placeholder):', existingTopics);


  // 3. Select a topic/skill for the new post
  //    TODO: Implement logic to choose a skill, potentially prioritizing less covered ones
  const selectedSkill = skills[Math.floor(Math.random() * skills.length)]; // Simple random selection for now
  console.log(`Selected skill for new post: ${selectedSkill}`);

  // 4. Construct the prompt for OpenAI
  //    TODO: Refine prompt engineering for better results and uniqueness check
  const prompt = `
    You are an expert software development blogger. Write a concise and informative blog post (around 300-500 words) suitable for a professional portfolio website.
    The post should focus on the skill: "${selectedSkill}".
    Explain what it is, why it's important, and maybe a brief example or use case relevant to web/mobile development.
    The tone should be professional but engaging.
    Do not use the exact title "${selectedSkill}" for the blog post itself. Create a slightly more engaging title.
    Format the output strictly as Markdown, including YAML frontmatter at the beginning with 'title' and 'date' (YYYY-MM-DD format).

    Example frontmatter format:
    ---
    title: "Understanding Asynchronous JavaScript"
    date: "2024-01-15"
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

  // --- Pre-process Markdown here --- 
  let postData = {};
  try {
    console.log('[generate-blog] Parsing generated Markdown with gray-matter...');
    const { data: frontmatter, content: contentBody } = matter(generatedMarkdown);

    // Validate frontmatter
    if (!frontmatter || !frontmatter.title || !frontmatter.date) {
      throw new Error('Generated content missing required frontmatter (title, date).');
    }
    console.log('[generate-blog] Parsed Frontmatter:', frontmatter);

    const postTitle = frontmatter.title.trim();
    const slug = postTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-')         
      .replace(/-+/g, '-');

    console.log('[generate-blog] Converting Markdown content to HTML using marked...');
    const htmlContent = marked.parse(contentBody.trim()); // Convert Markdown to HTML

    postData = {
        slug: slug,
        title: postTitle,
        date: frontmatter.date, // Keep original date string
        tags: frontmatter.tags || [], // Add tags if generated
        htmlContent: htmlContent // Store HTML content
    };
    console.log(`[generate-blog] Prepared JSON data for ${slug}.json (with HTML content)`);

  } catch (error) {
      console.error('[generate-blog] Error processing generated Markdown:', error);
      console.error('--- Faulty Markdown Start ---\n', generatedMarkdown.substring(0, 500), '\n--- Faulty Markdown End ---');
      return; // Stop if parsing fails
  }
  // --- End Pre-processing ---

  // --- Save as JSON --- 
  const filename = `${postData.slug}.json`; // Save as .json
  const filePath = path.join(blogContentDir, filename);
  console.log(`[generate-blog] Saving JSON to: ${filename}`);

  try {
    await fs.writeFile(filePath, JSON.stringify(postData, null, 2)); // Write JSON
    console.log(`Successfully wrote blog post JSON to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Run the generation function
generateBlogPost(); 