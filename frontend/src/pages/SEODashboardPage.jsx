import { useState, useEffect } from 'react';
import { Search, Globe, RefreshCw, CheckCircle, AlertCircle, TrendingUp, Link2, FileText, Send, Zap, Bot, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') || '';

const SEODashboardPage = () => {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [lastPing, setLastPing] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pingSearchEngines = async () => {
    setLoading(prev => ({ ...prev, ping: true }));
    try {
      const res = await fetch(`${API}/api/seo/ping-search-engines`);
      const data = await res.json();
      setResults(prev => ({ ...prev, ping: data }));
      setLastPing(new Date().toLocaleString());
    } catch (e) {
      console.error(e);
    }
    setLoading(prev => ({ ...prev, ping: false }));
  };

  const submitUrls = async () => {
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const res = await fetch(`${API}/api/seo/submit-urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [] })
      });
      const data = await res.json();
      setResults(prev => ({ ...prev, submit: data }));
    } catch (e) {
      console.error(e);
    }
    setLoading(prev => ({ ...prev, submit: false }));
  };

  const refreshSitemap = async () => {
    setLoading(prev => ({ ...prev, sitemap: true }));
    try {
      const res = await fetch(`${API}/api/seo/refresh-sitemap`);
      const data = await res.json();
      setResults(prev => ({ ...prev, sitemap: data }));
    } catch (e) {
      console.error(e);
    }
    setLoading(prev => ({ ...prev, sitemap: false }));
  };

  const runAudit = async () => {
    setLoading(prev => ({ ...prev, audit: true }));
    try {
      const res = await fetch(`${API}/api/seo/audit`);
      const data = await res.json();
      setResults(prev => ({ ...prev, audit: data }));
    } catch (e) {
      console.error(e);
    }
    setLoading(prev => ({ ...prev, audit: false }));
  };

  const seoTools = [
    {
      id: 'ping',
      title: 'Ping Search Engines',
      description: 'Notify Google, Bing, Yandex about your sitemap updates',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      action: pingSearchEngines,
      buttonText: 'Ping Now'
    },
    {
      id: 'submit',
      title: 'Submit URLs to IndexNow',
      description: 'Fast-track indexing on Bing, Yandex, Seznam',
      icon: Send,
      color: 'from-purple-500 to-pink-500',
      action: submitUrls,
      buttonText: 'Submit URLs'
    },
    {
      id: 'sitemap',
      title: 'Refresh Sitemap',
      description: 'Regenerate sitemap with all events and ping engines',
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
      action: refreshSitemap,
      buttonText: 'Refresh'
    },
    {
      id: 'audit',
      title: 'SEO Audit',
      description: 'Check your pages for SEO issues',
      icon: Search,
      color: 'from-orange-500 to-red-500',
      action: runAudit,
      buttonText: 'Run Audit'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">
              <Bot className="w-4 h-4 mr-2" />
              SEO Automation System
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Google Indexing Bot
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Tools to help Google and other search engines find and index your pages faster. 
              Get ranked on the first page!
            </p>
          </div>

          {/* Status Bar */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 mb-8 border border-zinc-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg mb-1">Indexing Status</h3>
                <p className="text-sm text-zinc-400">
                  Last ping: {lastPing || 'Never'}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">100+</div>
                  <div className="text-xs text-zinc-400">Pages Indexed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">4</div>
                  <div className="text-xs text-zinc-400">Search Engines</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {seoTools.map((tool) => (
              <div 
                key={tool.id}
                className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{tool.title}</h3>
                    <p className="text-sm text-zinc-400">{tool.description}</p>
                  </div>
                </div>

                <Button 
                  onClick={tool.action}
                  disabled={loading[tool.id]}
                  className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90`}
                >
                  {loading[tool.id] ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><Zap className="w-4 h-4 mr-2" /> {tool.buttonText}</>
                  )}
                </Button>

                {/* Results */}
                {results[tool.id] && (
                  <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">
                        {results[tool.id].status === 'success' || results[tool.id].status === 'completed' ? 'Success!' : 'Completed'}
                      </span>
                    </div>
                    <pre className="text-xs text-zinc-400 overflow-auto max-h-32">
                      {JSON.stringify(results[tool.id], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
            <h3 className="font-bold text-lg mb-4">Quick SEO Links</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a 
                href="https://search.google.com/search-console" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium">Google Search Console</div>
                  <div className="text-xs text-zinc-400">Submit & monitor</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 ml-auto" />
              </a>
              
              <a 
                href="https://www.bing.com/webmasters" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-medium">Bing Webmaster Tools</div>
                  <div className="text-xs text-zinc-400">IndexNow supported</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 ml-auto" />
              </a>
              
              <a 
                href={`${API}/api/sitemap.xml`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium">View Sitemap</div>
                  <div className="text-xs text-zinc-400">sitemap.xml</div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-500 ml-auto" />
              </a>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              How to Get on Google's First Page
            </h3>
            <ol className="space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">1</span>
                <span><strong>Submit Sitemap:</strong> Add <code className="bg-zinc-800 px-2 py-1 rounded text-sm">euromatchtickets.com/sitemap.xml</code> to Google Search Console</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">2</span>
                <span><strong>Ping Regularly:</strong> Click "Ping Search Engines" after adding new events or pages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">3</span>
                <span><strong>Use IndexNow:</strong> Submit URLs for instant indexing on Bing (which shares with others)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">4</span>
                <span><strong>Share Content:</strong> Use the Marketing Bot to create viral social posts that bring traffic</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">5</span>
                <span><strong>Get Backlinks:</strong> Post on Reddit, Quora, forums with links to your pages</span>
              </li>
            </ol>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SEODashboardPage;
