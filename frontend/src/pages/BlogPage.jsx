import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Flag, Music, Trophy, TrendingUp, BookOpen } from "lucide-react";
import { Badge } from "../components/ui/badge";
import SEOHead from "../components/SEOHead";
import BreadcrumbSchema from "../components/BreadcrumbSchema";
import { NewsletterSignup } from "../components/NewsletterSignup";

const categoryColors = {
  "F1": "bg-[#e10600]/20 text-[#ff4d4d] border-[#e10600]/30",
  "Concerts": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Buying Tips": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Stadium Guides": "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const categoryIcons = { "F1": Flag, "Concerts": Music, "Buying Tips": Trophy, "Stadium Guides": BookOpen };

// All blog articles - single source of truth, synced with BlogArticlePage.jsx
const allArticles = [
  {
    slug: "best-f1-circuits-2026",
    title: "10 Best F1 Circuits to Visit in 2026 - Ultimate Ranking",
    description: "Discover the 10 best F1 circuits to visit in 2026. Spa-Francorchamps, Monaco, Monza, Silverstone ranked by atmosphere, value & racing quality.",
    image: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg",
    category: "F1",
    readTime: "15 min read",
    date: "2026-04-11",
    featured: true,
  },
  {
    slug: "spa-francorchamps-travel-guide-2026",
    title: "Spa-Francorchamps Travel Guide 2026 - Hotels, Transport & Tips",
    description: "Complete Spa-Francorchamps travel guide 2026. Best hotels near Spa F1, how to get there, where to eat, what to pack.",
    image: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg",
    category: "F1",
    readTime: "12 min read",
    date: "2026-04-11",
    featured: true,
  },
  {
    slug: "how-to-buy-f1-tickets-2026",
    title: "How to Buy F1 Tickets 2026 - Complete Beginner's Guide",
    description: "Learn how to buy F1 tickets in 2026. Compare prices, find the cheapest Grand Prix, choose the best grandstand.",
    image: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg",
    category: "F1",
    readTime: "11 min read",
    date: "2026-04-11",
    featured: true,
  },
  {
    slug: "taylor-swift-eras-tour-london-guide-2026",
    title: "Taylor Swift Eras Tour London 2026 - Ultimate Fan Guide",
    description: "Complete guide to Taylor Swift Eras Tour London 2026 at Wembley Stadium. Best seats, setlist, what to wear, how to get there.",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    category: "Concerts",
    readTime: "10 min read",
    date: "2026-04-11",
    featured: true,
  },
  {
    slug: "best-seats-santiago-bernabeu",
    title: "Best Seats at Santiago Bernabeu: Complete Guide 2025",
    description: "Discover the best seating sections at Real Madrid's Santiago Bernabeu stadium. VIP boxes, lower tiers, and atmosphere zones explained.",
    image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    category: "Stadium Guides",
    readTime: "8 min read",
    date: "2025-02-15",
  },
  {
    slug: "how-to-buy-champions-league-tickets-safely",
    title: "How to Buy Champions League Tickets Safely in 2025",
    description: "Learn how to safely purchase UEFA Champions League tickets. Avoid scams and get verified tickets for Europe's biggest football matches.",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
    category: "Buying Tips",
    readTime: "6 min read",
    date: "2025-02-10",
  },
  {
    slug: "is-it-safe-to-buy-resale-concert-tickets",
    title: "Is It Safe to Buy Resale Concert Tickets? Your Complete Guide",
    description: "Everything you need to know about buying resale concert tickets safely. Identify legitimate sellers and understand your buyer protections.",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    category: "Buying Tips",
    readTime: "5 min read",
    date: "2025-02-05",
  },
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "F1", "Concerts", "Buying Tips", "Stadium Guides"];

  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = allArticles.filter(a => a.featured);

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="blog-page">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Blog", url: "https://euromatchtickets.com/blog" }]} />
      <SEOHead 
        title="F1 & Concert Ticket Guides 2026 | Expert Tips | EuroMatchTickets Blog"
        description="Expert guides on buying F1, Champions League, World Cup and concert tickets. Spa-Francorchamps travel guide, best F1 circuits 2026, Taylor Swift London tips. Market pricing may vary."
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#e10600]/8 to-transparent pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#e10600] text-sm font-bold uppercase tracking-widest mb-3">Expert Guides & Tips</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            EuroMatchTickets Blog
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            In-depth guides on buying tickets for Formula 1, World Cup, Champions League and major concerts. Expert tips, travel advice, and the listings on EuroMatchTickets.
          </p>
          
          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="blog-search"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#e10600]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-10" data-testid="blog-categories">
          {categories.map(cat => {
            const Icon = categoryIcons[cat] || TrendingUp;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                data-testid={`blog-cat-${cat.toLowerCase().replace(/\s/g,'-')}`}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-[#e10600] text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Featured Articles */}
        {selectedCategory === "All" && !searchQuery && (
          <div className="mb-14">
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#e10600]" />
              Featured Guides
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  data-testid={`blog-featured-${article.slug}`}
                  className="group bg-[#161620] border border-white/5 overflow-hidden hover:border-[#e10600]/40 transition-all"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161620] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className={categoryColors[article.category] || "bg-zinc-700 text-white"}>
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-white mb-2 group-hover:text-[#e10600] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-3">{article.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-600 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6">
            {selectedCategory === "All" ? `All Guides (${filteredArticles.length})` : `${selectedCategory} Guides`}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p>No articles match your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  data-testid={`blog-article-${article.slug}`}
                  className="group flex gap-4 bg-[#161620] border border-white/5 p-4 hover:border-[#e10600]/30 transition-all"
                >
                  <div className="w-28 h-20 overflow-hidden flex-shrink-0">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge className={`text-[10px] px-1.5 py-0 ${categoryColors[article.category] || "bg-zinc-700 text-white"}`}>
                        {article.category}
                      </Badge>
                      <span className="text-[10px] text-slate-600">{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1 group-hover:text-[#e10600] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-1">{article.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#e10600] group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links - Cross-linking to ticket pages */}
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          <div className="bg-[#161620] border border-white/5 p-5">
            <h3 className="font-black text-xs text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Flag className="w-3.5 h-3.5 text-[#e10600]" /> F1 Tickets
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/spa-f1-tickets", label: "Spa F1 Tickets 2026" },
                { to: "/monaco-grand-prix-tickets", label: "Monaco GP Tickets" },
                { to: "/f1-italian-grand-prix-monza-tickets", label: "Monza GP Tickets" },
                { to: "/f1-british-grand-prix-silverstone-tickets", label: "Silverstone GP" },
                { to: "/f1-tickets", label: "All F1 Tickets" },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-xs text-slate-500 hover:text-[#e10600] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="bg-[#161620] border border-white/5 p-5">
            <h3 className="font-black text-xs text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-[#e10600]" /> Football
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/champions-league-tickets", label: "Champions League" },
                { to: "/real-madrid-tickets", label: "Real Madrid Tickets" },
                { to: "/barcelona-tickets", label: "Barcelona Tickets" },
                { to: "/world-cup-2026", label: "World Cup 2026" },
                { to: "/el-clasico-tickets", label: "El Clasico Tickets" },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-xs text-slate-500 hover:text-[#e10600] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="bg-[#161620] border border-white/5 p-5">
            <h3 className="font-black text-xs text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-[#e10600]" /> Concerts
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/taylor-swift-london-tickets", label: "Taylor Swift London" },
                { to: "/coldplay-tour-2026", label: "Coldplay Tour 2026" },
                { to: "/bruno-mars-tour-2026", label: "Bruno Mars Tour" },
                { to: "/the-weeknd-tour-2026", label: "The Weeknd Tour" },
                { to: "/metallica-sphere-las-vegas-tickets", label: "Metallica Sphere" },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-xs text-slate-500 hover:text-[#e10600] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-14 bg-[#161620] border border-[#e10600]/10 p-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4">Your Ultimate Ticket Buying Resource</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-400 text-sm">
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2">What We Cover</h3>
              <ul className="space-y-1.5">
                <li>Formula 1 Grand Prix tickets for all 24 races worldwide</li>
                <li>FIFA World Cup 2026 complete buying guide</li>
                <li>Champions League, Premier League & La Liga</li>
                <li>Taylor Swift, Coldplay, Bruno Mars and 500+ concerts</li>
                <li>Price comparisons vs StubHub, Viagogo & Ticketmaster</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Why Trust EuroMatchTickets</h3>
              <ul className="space-y-1.5">
                <li>Buyer protection cancellation refund policy on every ticket</li>
                <li>Up to Competitive market pricing than official channels</li>
                <li>Instant QR code delivery to your phone</li>
                <li>Verified seller inventory across 25+ countries</li>
                <li>4.9/5 rating from 1+ verified reviews</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14">
          <NewsletterSignup source="blog-page" />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
