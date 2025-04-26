import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables from .env file
dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const blogContentDir = path.join(__dirname, '../src/content/blog'); // Adjust path if needed

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
  let generatedContent = '';
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or a newer model if you prefer
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // Adjust for creativity vs consistency
    });
    generatedContent = completion.choices[0].message?.content?.trim() || '';
    console.log('Content generated successfully.');
    // console.log('--- Generated Content ---');
    // console.log(generatedContent);
    // console.log('------------------------');

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return; // Exit if generation fails
  }

  // 6. Extract Title and Validate Content
  if (!generatedContent || !generatedContent.startsWith('---')) {
    console.error('Error: Generated content is empty or missing frontmatter.');
    return;
  }

  const frontmatterMatch = generatedContent.match(/^---\s*([\s\S]*?)\s*---/);
  if (!frontmatterMatch) {
      console.error('Error: Could not parse frontmatter from generated content.');
      return;
  }
  const frontmatterText = frontmatterMatch[1];
  const titleMatch = frontmatterText.match(/title:\s*["']?(.*?)["']?$/m);
  const postTitle = titleMatch ? titleMatch[1].trim() : '';

  if (!postTitle) {
      console.error('Error: Could not extract title from frontmatter.');
      return;
  }
  console.log(`Extracted post title: ${postTitle}`);

  // 7. Create filename (slugify the title)
  const slug = postTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-');         // Remove consecutive hyphens
  const filename = `${slug}.md`;
  const filePath = path.join(blogContentDir, filename);
  console.log(`Generated filename: ${filename}`);


  // 8. Write the content to a new Markdown file
  try {
    await fs.writeFile(filePath, generatedContent);
    console.log(`Successfully wrote blog post to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Run the generation function
generateBlogPost(); 