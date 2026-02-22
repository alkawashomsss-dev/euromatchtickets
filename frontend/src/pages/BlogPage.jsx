import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";

// Blog articles data - In production, this would come from a CMS or API
const blogArticles = [
  {
    id: "best-seats-santiago-bernabeu",
    title: "Best Seats at Santiago Bernabéu: Complete Guide 2025",
    excerpt: "Discover the best seating sections at Real Madrid's iconic stadium. From VIP boxes to the atmosphere in the South Stand, we cover everything you need to know.",
    image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    category: "Stadium Guides",
    readTime: "8 min read",
    date: "2025-02-15",
    featured: true
  },
  {
    id: "how-to-buy-champions-league-tickets-safely",
    title: "How to Buy Champions League Tickets Safely in 2025",
    excerpt: "Learn the safest ways to purchase UEFA Champions League tickets. Avoid scams and get verified tickets for the biggest matches in European football.",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
    category: "Buying Tips",
    readTime: "6 min read",
    date: "2025-02-10",
    featured: true
  },
  {
    id: "is-it-safe-to-buy-resale-concert-tickets",
    title: "Is It Safe to Buy Resale Concert Tickets? Your Complete Guide",
    excerpt: "Everything you need to know about buying resale tickets for concerts. From identifying legitimate sellers to understanding your buyer protections.",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    category: "Buying Tips",
    readTime: "5 min read",
    date: "2025-02-05",
    featured: false
  },
  {
    id: "premier-league-away-days-guide",
    title: "Premier League Away Days: The Ultimate Fan Guide",
    excerpt: "Planning to follow your team across England? Here's everything you need to know about attending away matches in the Premier League.",
    image: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg",
    category: "Stadium Guides",
    readTime: "10 min read",
    date: "2025-01-28",
    featured: false
  },
  {
    id: "taylor-swift-eras-tour-europe-2025",
    title: "Taylor Swift Eras Tour Europe 2025: Dates, Venues & Tickets",
    excerpt: "Complete guide to Taylor Swift's European tour dates. Find out which cities she's visiting and how to get tickets at the best prices.",
    image: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg",
    category: "Concert News",
    readTime: "7 min read",
    date: "2025-01-20",
    featured: true
  },
  {
    id: "el-clasico-atmosphere-guide",
    title: "El Clasico: What to Expect at Real Madrid vs Barcelona",
    excerpt: "Attending the biggest match in world football? Here's your complete guide to the El Clasico experience, from ticket categories to matchday atmosphere.",
    image: "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg",
    category: "Match Previews",
    readTime: "9 min read",
    date: "2025-01-15",
    featured: false
  }
];

const categories = ["All", "Buying Tips", "Stadium Guides", "Concert News", "Match Previews"];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = blogArticles.filter(a => a.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Blog - Football & Concert Ticket Tips"
        description="Expert tips on buying football and concert tickets in Europe. Stadium guides, buying advice, and the latest news on Champions League, Premier League, and major concerts."
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-900/20 to-transparent py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EuroMatchTickets Blog
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Expert guides, tips, and news about buying tickets for Europe's biggest football matches and concerts.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
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
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        {selectedCategory === "All" && !searchQuery && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map(article => (
                <Link 
                  key={article.id}
                  to={`/blog/${article.id}`}
                  className="group bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === "All" ? "All Articles" : selectedCategory}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles.map(article => (
                <Link
                  key={article.id}
                  to={`/blog/${article.id}`}
                  className="group flex flex-col md:flex-row gap-6 bg-zinc-900/50 border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all"
                >
                  <div className="md:w-64 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-zinc-800 text-purple-400 text-xs rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-purple-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-zinc-400 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-zinc-900/30 border border-white/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Your Trusted Source for Ticket Buying Advice</h2>
          <p className="text-zinc-400 leading-relaxed mb-4">
            At EuroMatchTickets, we're passionate about helping fans attend the events they love. Our blog provides 
            expert advice on buying football tickets for major competitions like the UEFA Champions League, Premier League, 
            La Liga, and Bundesliga. We also cover the hottest concert tours across Europe.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Whether you're looking for the best seats at Camp Nou, tips on avoiding ticket scams, or the latest news 
            on upcoming tours, our team of experts has you covered. All our advice is based on real experience helping 
            thousands of fans secure their tickets safely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
