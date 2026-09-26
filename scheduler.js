import cron from 'node-cron';
import { dbQuery, dbRun } from '../db/database.js';
import { publishToFacebook } from '../services/social/facebookConnector.js';

export function initScheduler() {
  // Run daily at 9:00 AM (configure as needed)
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily content publishing scheduler...');
    await processDailyPosts();
  });
  
  console.log('Scheduler initialized (Runs daily at 9:00 AM)');
}

async function processDailyPosts() {
  try {
    // Find posts that are 'approved' but not yet 'published', for the current day.
    // Note: In a real app, you might want logic to figure out which 'day' number it is relative to the start date.
    // Here we'll just look for any approved post that hasn't been published yet.
    const pendingPosts = await dbQuery("SELECT * FROM posts WHERE status = 'approved' LIMIT 1");
    
    for (const post of pendingPosts) {
      console.log(\`Attempting to publish post ID \${post.id} (Day \${post.day})\`);
      
      let success = false;
      let platformPostId = null;
      let errorLog = null;

      try {
        // Here you would check post.platform and call the correct connector
        // For now, we assume Facebook.
        const result = await publishToFacebook(post.caption, post.image_path, JSON.parse(post.hashtags || '[]'));
        
        success = true;
        platformPostId = result.id;
      } catch (err) {
        success = false;
        errorLog = err.message;
        console.error(\`Failed to publish post ID \${post.id}:\`, err);
      }

      // Update DB
      if (success) {
        await dbRun(
          "UPDATE posts SET status = 'published', post_id = ?, published_at = CURRENT_TIMESTAMP WHERE id = ?",
          [platformPostId, post.id]
        );
      } else {
        await dbRun(
          "UPDATE posts SET status = 'failed', error_log = ? WHERE id = ?",
          [errorLog, post.id]
        );
      }
    }
  } catch (error) {
    console.error('Error in daily scheduler:', error);
  }
}
