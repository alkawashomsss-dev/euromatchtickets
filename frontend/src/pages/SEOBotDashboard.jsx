import { useState, useEffect } from "react";
import { 
  Bot, Zap, TrendingUp, Search, RefreshCw, 
  CheckCircle, Clock, Target, BarChart3, 
  Globe, FileText, Sparkles, AlertCircle,
  Play, Pause, Settings, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { API } from "../App";

const SEOBotDashboard = () => {
  const [botStatus, setBotStatus] = useState(null);
  const [keywords, setKeywords] = useState({});
  const [contentIdeas, setContentIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("f1");

  const categories = [
    { id: "f1", name: "Formula 1", icon: "🏎️", color: "red" },
    { id: "motogp", name: "MotoGP", icon: "🏍️", color: "orange" },
    { id: "worldcup", name: "World Cup", icon: "⚽", color: "green" },
    { id: "isle_of_man_tt", name: "Isle of Man TT", icon: "🏝️", color: "blue" },
    { id: "concerts", name: "Concerts", icon: "🎵", color: "purple" }
  ];

  useEffect(() => {
    fetchBotStatus();
    fetchKeywords(selectedCategory);
    fetchContentIdeas();
  }, [selectedCategory]);

  const fetchBotStatus = async () => {
    try {
      const res = await axios.get(`${API}/seo-bot/status`);
      setBotStatus(res.data);
    } catch (error) {
      console.error("Error fetching bot status:", error);
    }
  };

  const fetchKeywords = async (category) => {
    try {
      const res = await axios.get(`${API}/seo-bot/keywords/${category}`);
      setKeywords(res.data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentIdeas = async () => {
    try {
      const res = await axios.get(`${API}/seo-bot/content-ideas`);
      setContentIdeas(res.data.ideas || []);
    } catch (error) {
      console.error("Error fetching content ideas:", error);
    }
  };

  const runOptimization = async () => {
    setRunning(true);
    try {
      const res = await axios.post(`${API}/seo-bot/run`);
      toast.success("🤖 SEO Optimization cycle completed!");
      fetchBotStatus();
      fetchKeywords(selectedCategory);
    } catch (error) {
      toast.error("Error running optimization");
    } finally {
      setRunning(false);
    }
  };

  const pingSearchEngines = async () => {
    try {
      const res = await axios.post(`${API}/seo-bot/ping-search-engines`);
      toast.success("✅ Search engines notified!");
    } catch (error) {
      toast.error("Error pinging search engines");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-[#0e0e14] pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-none flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SEO Bot Dashboard</h1>
                <p className="text-slate-500 text-sm">24/7 Intelligent Keyword Optimizer</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={pingSearchEngines}
              variant="outline"
              className="border-cyan-500/50 text-cyan-600"
            >
              <Globe className="w-4 h-4 mr-2" />
              Ping Google
            </Button>
            <Button 
              onClick={runOptimization}
              disabled={running}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {running ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {running ? "Running..." : "Run Optimization"}
            </Button>
          </div>
        </div>

        {/* Bot Status Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Bot Status</span>
              {botStatus?.is_running ? (
                <Badge className="bg-emerald-500/10 text-emerald-600">Running</Badge>
              ) : (
                <Badge className="bg-blue-500/10 text-blue-600">Idle</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${botStatus?.is_running ? 'bg-emerald-500/100 animate-pulse' : 'bg-blue-500/100'}`} />
              <span className="font-semibold">{botStatus?.is_running ? "Optimizing..." : "Monitoring"}</span>
            </div>
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Keywords Tracked</span>
              <Search className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-bold">{botStatus?.total_keywords_tracked || 0}</div>
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Last Update</span>
              <Clock className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-sm font-medium">
              {botStatus?.last_update 
                ? new Date(botStatus.last_update).toLocaleString() 
                : "Not yet"}
            </div>
          </div>

          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm">Next Update</span>
              <RefreshCw className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm font-medium">
              {botStatus?.next_update 
                ? new Date(botStatus.next_update).toLocaleString() 
                : "Pending"}
            </div>
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
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-white/10"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Keywords List */}
          <div className="lg:col-span-2 bg-[#1e1e1e] border border-white/10 rounded-none p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-600" />
                Trending Keywords - {keywords.month || "Current Month"}
              </h2>
              <Badge>{keywords.total_keywords || 0} keywords</Badge>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(keywords.keywords || []).map((kw, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#15151e] rounded-none hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm w-6">{idx + 1}</span>
                    <span className="font-medium">{kw.keyword}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${kw.score >= 80 ? 'bg-emerald-500/100' : kw.score >= 60 ? 'bg-yellow-500' : 'bg-[#e10600]/100'}`}
                        style={{ width: `${kw.score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(kw.score)}`}>
                      {kw.score.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Ideas */}
          <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Content Ideas
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {contentIdeas.slice(0, 10).map((idea, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-[#15151e] rounded-none border border-white/10/50 hover:border-purple-500/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {idea.category}
                    </Badge>
                    <span className={`text-xs font-bold ${getScoreColor(idea.priority)}`}>
                      {idea.priority.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{idea.title}</p>
                  <p className="text-xs text-slate-400 mt-1">Keyword: {idea.keyword}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Update History */}
        <div className="mt-8 bg-[#1e1e1e] border border-white/10 rounded-none p-6">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            Recent Updates
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-white/10">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(botStatus?.update_history || []).reverse().map((update, idx) => (
                  <tr key={idx} className="border-b border-white/10/50">
                    <td className="py-3 text-sm">
                      {new Date(update.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3">
                      {update.success ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge className="bg-[#e10600]/10 text-red-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      {update.actions_completed || 0} actions completed
                    </td>
                  </tr>
                ))}
                {(!botStatus?.update_history || botStatus.update_history.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      No updates yet. Click "Run Optimization" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-none p-6">
          <h2 className="text-lg font-bold mb-4">🤖 How the SEO Bot Works</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-violet-50 rounded-none flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-violet-600">1</span>
              </div>
              <div>
                <p className="font-medium">Keyword Analysis</p>
                <p className="text-slate-500">Analyzes trending keywords based on season and events</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-none flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-cyan-600">2</span>
              </div>
              <div>
                <p className="font-medium">Score Calculation</p>
                <p className="text-slate-500">Calculates effectiveness score for each keyword</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-none flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-emerald-600">3</span>
              </div>
              <div>
                <p className="font-medium">Meta Optimization</p>
                <p className="text-slate-500">Generates optimized titles & descriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-none flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-amber-600">4</span>
              </div>
              <div>
                <p className="font-medium">Search Engine Ping</p>
                <p className="text-slate-500">Notifies Google & Bing of updates</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SEOBotDashboard;
