# AI Social Media Content Automation

A full-stack application that automatically generates a 30-day social media content calendar (including captions, hashtags, and images) using Gemini AI, allows manual review/approval, and publishes approved posts to your social platforms automatically.

## Project Structure

- `backend/`: Node.js + Express backend, SQLite database, node-cron scheduler, and Gemini/Social integrations.
- `frontend/`: React + Tailwind CSS dashboard to configure niches, generate content, and review posts.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Setup Backend
1. Navigate to the backend directory: \`cd backend\`
2. Install dependencies: \`npm install\`
3. Rename \`.env.example\` to \`.env\` and fill in the required API keys (see below).
4. Run the server: \`npm run dev\`

### 2. Setup Frontend
1. Navigate to the frontend directory: \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Run the Vite dev server: \`npm run dev\`

## API Keys & Integrations Setup

### 1. Gemini API Key (For Text & Image Generation)
1. Go to [Google AI Studio](https://aistudio.google.com).
2. Click "Get API key" and create a new key.
3. Add it to `backend/.env` under `GEMINI_API_KEY`.

### 2. Facebook & Instagram API Setup
1. Go to [Meta for Developers](https://developers.facebook.com) and create an App (Type: Business).
2. Add the **Facebook Login for Business** product.
3. Link your Facebook Page and Instagram Business account.
4. Generate a **Page Access Token** via the Graph API Explorer with permissions: `pages_manage_posts`, `pages_read_engagement`, and `instagram_content_publish`.
5. Add your Page ID and Token to the `.env` file.

### 3. LinkedIn API (Optional)
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com) and create an app.
2. Request the "Share on LinkedIn" and "Sign In with LinkedIn" products.
3. Obtain OAuth 2.0 credentials and generate a token with `w_member_social` or `w_organization_social` scope.

### 4. X (Twitter) API (Optional)
1. Go to [X Developer Portal](https://developer.x.com) and create a project.
2. Get the API Key, API Secret, Access Token, and Access Token Secret.

## How it Works

1. **Dashboard**: The user inputs a niche and brand tone.
2. **Gemini Text**: The backend calls Gemini `gemini-1.5-flash` to generate a 30-day strict JSON calendar.
3. **Draft Mode**: Posts are saved to SQLite in `draft` status.
4. **Approval**: The user clicks "Approve" on the dashboard.
5. **Scheduler**: A background cron job (`backend/cron/scheduler.js`) runs daily at a configured time, finds the pending approved posts for that day, and pushes them to Facebook using the `facebookConnector`.

## Deployment

For a production environment, consider the following:
1. Move the SQLite DB to a persistent volume, or migrate to PostgreSQL.
2. Deploy the Express backend to a small VPS (like DigitalOcean, Linode) or a Docker container to ensure the node-cron scheduler stays running 24/7.
3. Host the React frontend on Vercel, Netlify, or serve it directly from the Express backend via static serving.
