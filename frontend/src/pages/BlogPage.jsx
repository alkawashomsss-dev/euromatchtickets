import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Tag, Zap, Globe, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import axios from "axios";
import { API } from "../App";

// Category colors
const categoryColors = {
  "F1": "bg-red-50 text-red-600 border-red-200",
  "World Cup": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Football": "bg-blue-50 text-blue-600 border-blue-200",
  "Concerts": "bg-violet-50 text-violet-600 border-violet-200",
  "City Guide": "bg-amber-50 text-amber-600 border-amber-200",
  "Comparison": "bg-cyan-500/20 text-cyan-600 border-cyan-500/30",
  "MotoGP": "bg-orange-50 text-orange-600 border-orange-200"
};

// Fallback category images (used only if article has no specific image)
const categoryImages = {
  "F1": "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg",
  "World Cup": "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
  "Football": "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
  "Concerts": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
  "City Guide": "https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg",
  "Comparison": "https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg",
  "MotoGP": "https://images.pexels.com/photos/39693/motorcycle-racer-racing-race-speed-39693.jpeg"
};

// Get image for article - prioritize article's own image, fallback to category
const getArticleImage = (article) => {
  return article.image || categoryImages[article.category] || categoryImages["Football"];
};

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(null);
  const [generating, setGenerating] = useState(false);

  const categories = ["All", "F1", "World Cup", "Football", "Concerts", "City Guide", "Comparison"];

  // Fetch articles from Super SEO Bot
  useEffect(() => {
    fetchArticles();
    fetchStats();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // First try Ultra Bot (premium SEO)
      let response = await axios.get(`${API}/ultra-bot/articles`);
      if (response.data.articles && response.data.articles.length > 0) {
        setArticles(response.data.articles);
      } else {
        // Fallback to Super SEO Bot
        response = await axios.get(`${API}/super-seo/articles`);
        if (response.data.articles && response.data.articles.length > 0) {
          setArticles(response.data.articles);
        } else {
          // Generate new articles if none exist
          await generateArticles(50);
        }
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Fallback to static articles
      setArticles(getStaticArticles());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Try Ultra Bot stats first
      let response = await axios.get(`${API}/ultra-bot/stats`);
      if (response.data) {
        setStats(response.data);
      } else {
        response = await axios.get(`${API}/super-seo/stats`);
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const generateArticles = async (count = 50) => {
    try {
      setGenerating(true);
      // Use Ultra Bot for premium SEO articles
      const response = await axios.get(`${API}/ultra-bot/generate/${count}`);
      if (response.data.articles) {
        setArticles(response.data.articles);
        // Auto-index after generation
        await axios.post(`${API}/ultra-bot/index`);
      }
      await fetchStats();
    } catch (error) {
      console.error("Error generating articles:", error);
    } finally {
      setGenerating(false);
    }
  };

  const getStaticArticles = () => [
    {
      id: "f1-monaco-guide",
      title_en: "Monaco Grand Prix Tickets 2026 - Complete Buying Guide",
      title_ar: "تذاكر جائزة موناكو الكبرى 2026",
      category: "F1",
      meta_description: "Buy Monaco GP tickets from €350. Best grandstands, prices, and tips.",
      min_price: 350,
      created_at: new Date().toISOString()
    },
    {
      id: "worldcup-final",
      title_en: "World Cup 2026 Final Tickets - How to Buy",
      title_ar: "تذاكر نهائي كأس العالم 2026",
      category: "World Cup",
      meta_description: "Get World Cup Final tickets. Best prices guaranteed.",
      min_price: 1500,
      created_at: new Date().toISOString()
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const title = article.title_en || article.title || "";
    const desc = article.meta_description || "";
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.slice(0, 6);

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20">
      <SEOHead 
        title="Blog - Ticket Guides & News | EuroMatchTickets"
        description="Expert guides on buying F1, World Cup, football and concert tickets. Daily updated articles with best prices and tips."
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-900/20 to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Content
            </Badge>
            {stats && (
              <Badge variant="outline" className="text-slate-500">
                {stats.total_articles_generated}+ Articles Generated
              </Badge>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EuroMatchTickets Blog
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mb-6">
            Daily updated guides on buying tickets for F1, World Cup, football matches and concerts. 
            Best prices, expert tips, and insider knowledge.
          </p>
          
          {/* Generate Button */}
          <Button 
            onClick={() => generateArticles(50)}
            disabled={generating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate 50 New Articles
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">{stats.events_covered?.f1_races || stats.events_covered?.f1 || 11}</div>
              <div className="text-xs text-slate-400">F1 Races</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.events_covered?.worldcup_matches || stats.events_covered?.worldcup || 6}</div>
              <div className="text-xs text-slate-400">World Cup</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.events_covered?.football_clubs || stats.events_covered?.football || 8}</div>
              <div className="text-xs text-slate-400">Football Clubs</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.events_covered?.concerts || 8}</div>
              <div className="text-xs text-slate-400">Concerts</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.total_keywords || stats.keywords_database || 80}</div>
              <div className="text-xs text-slate-400">SEO Keywords</div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            {/* Featured Articles Grid */}
            {selectedCategory === "All" && !searchQuery && featuredArticles.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-violet-600" />
                  Featured Guides
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredArticles.map((article, idx) => (
                    <Link 
                      key={article.id || idx}
                      to={`/blog/${article.slug || article.id}`}
                      className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-violet-200 transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={getArticleImage(article)} 
                          alt={article.title_en || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className={categoryColors[article.category] || "bg-zinc-700"}>
                            {article.category}
                          </Badge>
                        </div>
                        {article.city && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                              {article.city}
                            </Badge>
                          </div>
                        )}
                        {article.min_price && (
                          <div className="absolute bottom-3 right-3">
                            <Badge className="bg-emerald-500/90 text-white">
                              From €{article.min_price}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-violet-600 transition-colors line-clamp-2">
                          {article.title_en || article.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                          {article.meta_description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            EN/AR
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory === "All" ? `All Articles (${filteredArticles.length})` : selectedCategory}
              </h2>
              
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No articles found. Click "Generate 50 New Articles" to create content.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredArticles.map((article, idx) => (
                    <Link
                      key={article.id || idx}
                      to={`/blog/${article.slug || article.id}`}
                      className="group flex gap-4 bg-white border border-slate-100 rounded-xl p-4 hover:border-violet-200 transition-all"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={getArticleImage(article)} 
                          alt={article.title_en || article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${categoryColors[article.category] || "bg-zinc-700"}`}>
                            {article.category}
                          </Badge>
                          {article.city && (
                            <span className="text-xs text-slate-400">{article.city}</span>
                          )}
                          {article.min_price && (
                            <span className="text-xs text-emerald-600">€{article.min_price}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-violet-600 transition-colors line-clamp-2">
                          {article.title_en || article.title}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-1">
                          {article.meta_description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-violet-600 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* SEO Content */}
        <div className="mt-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">🎯 Your Ultimate Ticket Buying Resource</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-500">
            <div>
              <h3 className="font-semibold text-white mb-2">What We Cover:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Formula 1 Grand Prix tickets worldwide</li>
                <li>✅ FIFA World Cup 2026 complete guide</li>
                <li>✅ Champions League & Premier League</li>
                <li>✅ Major concerts and tours</li>
                <li>✅ Price comparisons & best deals</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Why Trust Us:</h3>
              <ul className="space-y-1 text-sm">
                <li>🛡️ FanProtect™ Guarantee on all tickets</li>
                <li>💰 25% cheaper than competitors</li>
                <li>⚡ Instant QR code delivery</li>
                <li>🌍 Available in 16 languages</li>
                <li>📞 24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
