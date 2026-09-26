import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, CheckCircle, Image as ImageIcon, Send, Edit2, AlertTriangle } from 'lucide-react';
// import axios from 'axios'; // Un-comment when testing with actual backend

const API_URL = 'http://localhost:3001/api';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Form State
  const [niche, setNiche] = useState('');
  const [brandTone, setBrandTone] = useState('Professional');
  const [platforms, setPlatforms] = useState(['Facebook']);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // MOCK DATA for display purposes if backend is down
      // const res = await axios.get(\`\${API_URL}/posts\`);
      // setPosts(res.data);
      
      setPosts([
        { id: 1, day: 1, theme: 'Welcome & Introduction', caption: 'Hello world! Welcome to our new page.', hashtags: ['#welcome', '#hello'], status: 'draft', image_prompt: 'A friendly robot waving.' },
        { id: 2, day: 2, theme: 'Product Showcase', caption: 'Check out our amazing new AI tool.', hashtags: ['#ai', '#tech'], status: 'approved', image_path: 'https://placehold.co/600x400/png' },
      ]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      // await axios.post(\`\${API_URL}/generate-calendar\`, { niche, brandTone, platforms });
      alert("Calendar generated successfully! (Mocked)");
      fetchPosts();
    } catch (error) {
      alert("Error generating calendar");
    }
    setGenerating(false);
  };

  const handleApprove = async (id) => {
    try {
      // await axios.patch(\`\${API_URL}/posts/\${id}\`, { status: 'approved' });
      setPosts(posts.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleGenerateImage = async (id) => {
    try {
      // const res = await axios.post(\`\${API_URL}/posts/\${id}/generate-image\`);
      // Update with mock path for now
      setPosts(posts.map(p => p.id === id ? { ...p, image_path: 'https://placehold.co/600x400/png?text=Generated' } : p));
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      published: 'bg-blue-100 text-blue-800 border-blue-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
      <span className={\`px-2.5 py-0.5 rounded-full text-xs font-medium border \${styles[status] || styles.draft} uppercase tracking-wider\`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Generate 30-Day Calendar
        </h2>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Niche / Topic</label>
            <input 
              type="text" 
              required
              placeholder="e.g. AI SaaS for Content Creators"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Tone</label>
            <select 
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Professional</option>
              <option>Casual & Friendly</option>
              <option>Humorous</option>
              <option>Inspirational</option>
            </select>
          </div>
          <div>
            <button 
              type="submit" 
              disabled={generating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              {generating ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Content Calendar</h2>
          <button onClick={fetchPosts} className="text-slate-500 hover:text-slate-900 p-2">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No posts generated yet. Use the form above to start.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
                
                {/* Image Section */}
                <div className="h-48 bg-slate-100 relative group border-b border-slate-200">
                  {post.image_path ? (
                    <img src={post.image_path} alt="Generated" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-xs">{post.image_prompt}</p>
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleGenerateImage(post.id)}
                      className="bg-white text-slate-900 text-sm font-medium py-1 px-3 rounded shadow hover:bg-slate-50"
                    >
                      {post.image_path ? 'Regenerate' : 'Generate Image'}
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-500 uppercase">Day {post.day}</span>
                    <StatusBadge status={post.status} />
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2">{post.theme}</h3>
                  <p className="text-slate-600 text-sm mb-3 flex-grow line-clamp-4">{post.caption}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.hashtags?.map((tag, i) => (
                      <span key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {tag.startsWith('#') ? tag : \`#\${tag}\`}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    {post.status === 'draft' && (
                      <button 
                        onClick={() => handleApprove(post.id)}
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 font-medium py-1.5 rounded text-sm flex items-center justify-center transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                      </button>
                    )}
                    <button className="flex-1 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium py-1.5 rounded text-sm flex items-center justify-center transition-colors border border-slate-200">
                      <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
