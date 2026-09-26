import express from 'express';
import { generateContentCalendar, generateImage } from '../services/geminiService.js';
import { dbRun, dbQuery } from '../db/database.js';

const router = express.Router();

// 1. Generate 30-Day Calendar
router.post('/generate-calendar', async (req, res) => {
  const { niche, brandTone, platforms } = req.body;
  
  if (!niche) {
    return res.status(400).json({ error: 'Niche is required' });
  }

  try {
    const calendar = await generateContentCalendar(niche, brandTone || 'Professional', platforms || ['Facebook']);
    
    // Save to Database
    for (const post of calendar) {
      await dbRun(
        \`INSERT INTO posts (day, theme, caption, hashtags, image_prompt, status) 
         VALUES (?, ?, ?, ?, ?, 'draft')\`,
        [post.day, post.theme, post.caption, JSON.stringify(post.hashtags), post.image_prompt]
      );
    }
    
    res.json({ success: true, message: '30-day calendar generated and saved as drafts.', count: calendar.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate calendar', details: error.message });
  }
});

// 2. Get All Posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await dbQuery('SELECT * FROM posts ORDER BY day ASC');
    // Parse hashtags back to array
    const formattedPosts = posts.map(p => ({
      ...p,
      hashtags: p.hashtags ? JSON.parse(p.hashtags) : []
    }));
    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 3. Generate Image for a specific post
router.post('/posts/:id/generate-image', async (req, res) => {
  const { id } = req.params;
  
  try {
    const posts = await dbQuery('SELECT * FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
    
    const post = posts[0];
    const imagePath = await generateImage(post.image_prompt, post.day);
    
    await dbRun('UPDATE posts SET image_path = ? WHERE id = ?', [imagePath, id]);
    
    res.json({ success: true, image_path: imagePath });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// 4. Update Post Status (e.g., approve)
router.patch('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { status, caption } = req.body; // allow editing caption and status
  
  try {
    const updates = [];
    const params = [];
    
    if (status) { updates.push('status = ?'); params.push(status); }
    if (caption) { updates.push('caption = ?'); params.push(caption); }
    
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    
    params.push(id);
    await dbRun(\`UPDATE posts SET \${updates.join(', ')} WHERE id = ?\`, params);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

export default router;
