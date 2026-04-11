import { useState, useEffect } from "react";
import { 
  Megaphone, Copy, Twitter, Instagram, Facebook, 
  MessageCircle, Mail, RefreshCw, Calendar,
  TrendingUp, Users, Share2, Zap, FileText,
  CheckCircle, Sparkles, Target, Clock
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { API } from "../App";

const FreeMarketingPage = () => {
  const [posts, setPosts] = useState({});
  const [calendar, setCalendar] = useState({});
  const [blogIdeas, setBlogIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("f1");
  const [copiedPost, setCopiedPost] = useState(null);

  const categories = [
    { id: "f1", name: "Formula 1", icon: "🏎️" },
    { id: "motogp", name: "MotoGP", icon: "🏍️" },
    { id: "worldcup", name: "World Cup", icon: "⚽" },
    { id: "concerts", name: "Concerts", icon: "🎤" },
    { id: "engagement", name: "Engagement", icon: "💬" }
  ];

  useEffect(() => {
    fetchContent();
  }, [selectedCategory]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [twitterRes, instaRes, calendarRes, blogRes] = await Promise.all([
        axios.get(`${API}/marketing-bot/twitter/${selectedCategory}`),
        axios.get(`${API}/marketing-bot/instagram/${selectedCategory}`),
        axios.get(`${API}/marketing-bot/content-calendar`),
        axios.get(`${API}/marketing-bot/blog-ideas`)
      ]);
      
      setPosts({
        twitter: twitterRes.data,
        instagram: instaRes.data
      });
      setCalendar(calendarRes.data.calendar || {});
      setBlogIdeas(blogRes.data.ideas || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, platform) => {
    navigator.clipboard.writeText(text);
    setCopiedPost(platform);
    toast.success(`Copied ${platform} post!`);
    setTimeout(() => setCopiedPost(null), 2000);
  };

  const regenerate = () => {
    fetchContent();
    toast.success("Generated new content!");
  };

  return (
    <div className="min-h-screen bg-[#0e0e14] pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-orange-600 rounded-none flex items-center justify-center">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Free Marketing Tools</h1>
                <p className="text-slate-500 text-sm">Generate viral posts • No ads needed</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={regenerate}
            className="bg-gradient-to-r from-pink-600 to-orange-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Posts
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Strategy</span>
              <Target className="w-4 h-4 text-pink-600" />
            </div>
            <div className="font-semibold">Organic Growth</div>
            <p className="text-xs text-slate-400 mt-1">No paid ads</p>
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Platforms</span>
              <Share2 className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="font-semibold">5 Channels</div>
            <p className="text-xs text-slate-400 mt-1">Twitter, IG, FB, Reddit, WhatsApp</p>
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Content Ideas</span>
              <FileText className="w-4 h-4 text-violet-600" />
            </div>
            <div className="font-semibold">{blogIdeas.length} Blog Posts</div>
            <p className="text-xs text-slate-400 mt-1">SEO optimized</p>
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Weekly Posts</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-semibold">7 Days</div>
            <p className="text-xs text-slate-400 mt-1">Auto calendar</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-none transition-colors ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-pink-600 to-orange-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-white/10"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          
          {/* Twitter Post */}
          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-sky-400" />
                <h2 className="font-bold">Twitter / X Post</h2>
              </div>
              <Badge variant="outline">{posts.twitter?.character_count || 0} chars</Badge>
            </div>
            
            <div className="bg-[#15151e] rounded-none p-4 mb-4 min-h-[150px]">
              <p className="whitespace-pre-wrap text-sm">{posts.twitter?.post || "Loading..."}</p>
            </div>
            
            <Button 
              onClick={() => copyToClipboard(posts.twitter?.post, 'twitter')}
              className="w-full"
              variant={copiedPost === 'twitter' ? 'default' : 'outline'}
            >
              {copiedPost === 'twitter' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Tweet
                </>
              )}
            </Button>
          </div>

          {/* Instagram Post */}
          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                <h2 className="font-bold">Instagram Caption</h2>
              </div>
              <Badge variant="outline">With Hashtags</Badge>
            </div>
            
            <div className="bg-[#15151e] rounded-none p-4 mb-4 min-h-[150px]">
              <p className="whitespace-pre-wrap text-sm">{posts.instagram?.caption || "Loading..."}</p>
            </div>
            
            <Button 
              onClick={() => copyToClipboard(posts.instagram?.caption, 'instagram')}
              className="w-full"
              variant={copiedPost === 'instagram' ? 'default' : 'outline'}
            >
              {copiedPost === 'instagram' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Caption
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Weekly Content Calendar */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Weekly Content Calendar
            </h2>
            <Badge className="bg-emerald-500/10 text-emerald-600">Auto-generated</Badge>
          </div>

          <div className="grid md:grid-cols-7 gap-3">
            {Object.entries(calendar).map(([day, content]) => (
              <div 
                key={day}
                className="bg-[#15151e] rounded-none p-3 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => copyToClipboard(content.twitter, day)}
              >
                <div className="font-semibold text-sm mb-2">{day}</div>
                <Badge variant="outline" className="text-xs mb-2">{content.category}</Badge>
                <p className="text-xs text-slate-500 line-clamp-3">{content.twitter?.substring(0, 80)}...</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {content.best_time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Ideas for SEO */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              SEO Blog Post Ideas
            </h2>
            <Badge>{blogIdeas.length} ideas</Badge>
          </div>

          <div className="space-y-4">
            {blogIdeas.map((idea, idx) => (
              <div 
                key={idx}
                className="bg-[#15151e] rounded-none p-4 hover:bg-white/10 transition-colors"
              >
                <h3 className="font-semibold mb-2">{idea.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {idea.keywords.map((kw, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{kw}</Badge>
                  ))}
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-medium">Outline:</span> {idea.outline.join(" → ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Marketing Strategy */}
        <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-none p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Free Marketing Strategy (No Ads!)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-pink-600 mb-2">📱 Social Media</h3>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Post 2-3 times daily</li>
                <li>• Use trending hashtags</li>
                <li>• Engage with F1/MotoGP accounts</li>
                <li>• Reply to fans asking for tickets</li>
                <li>• Join Facebook groups</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-cyan-600 mb-2">✍️ Content Marketing</h3>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Write blog posts (SEO)</li>
                <li>• Create how-to guides</li>
                <li>• Price comparison articles</li>
                <li>• Event preview content</li>
                <li>• Share on Reddit</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-emerald-600 mb-2">🔗 Viral Tactics</h3>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Referral program (€10 reward)</li>
                <li>• Giveaway contests</li>
                <li>• User testimonials</li>
                <li>• WhatsApp sharing</li>
                <li>• Telegram groups</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-[#1e1e1e] rounded-none">
            <h4 className="font-semibold mb-2">🎯 Daily Action Plan:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Morning:</span>
                <p>Post on Twitter & Instagram</p>
              </div>
              <div>
                <span className="text-slate-500">Afternoon:</span>
                <p>Engage in Facebook groups</p>
              </div>
              <div>
                <span className="text-slate-500">Evening:</span>
                <p>Reply to comments, share to WhatsApp</p>
              </div>
              <div>
                <span className="text-slate-500">Weekly:</span>
                <p>Write 1 blog post, run 1 giveaway</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FreeMarketingPage;
