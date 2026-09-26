import { dbQuery, dbRun } from '../db/database.js';
import { publishToFacebook } from '../services/social/facebookConnector.js';

export async function processDailyPosts() {
  try {
    // Find posts that are 'approved' but not yet 'published'
    // Postgres LIMIT syntax
    const pendingPosts = await dbQuery("SELECT * FROM posts WHERE status = 'approved' LIMIT 1");
    
    if (pendingPosts.length === 0) {
      console.log('No pending approved posts found for today.');
      return { success: true, message: 'No posts to publish.' };
    }

    const post = pendingPosts[0];
    console.log(\`Attempting to publish post ID \${post.id} (Day \${post.day})\`);
    
    let success = false;
    let platformPostId = null;
    let errorLog = null;

    try {
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
      return { success: true, message: \`Post \${post.id} published successfully.\` };
    } else {
      await dbRun(
        "UPDATE posts SET status = 'failed', error_log = ? WHERE id = ?",
        [errorLog, post.id]
      );
      return { success: false, error: errorLog, message: \`Failed to publish post \${post.id}.\` };
    }
  } catch (error) {
    console.error('Error in daily scheduler:', error);
    throw error;
  }
}
