import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Share2, Mail, Bell, TrendingUp, Target, Users, 
  Copy, Check, Twitter, Facebook, Linkedin, MessageCircle,
  Zap, Gift, Calendar, DollarSign, BarChart3, Megaphone,
  RefreshCw, ExternalLink, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useAuth, API } from '../App';
import axios from 'axios';

const MarketingDashboard = () => {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState(null);
  const [socialPosts, setSocialPosts] = useState([]);
  const [growthPlan, setGrowthPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [referralRes, postsRes, planRes] = await Promise.all([
        user ? axios.get(`${API}/marketing/referral/${user.user_id}`) : null,
        axios.get(`${API}/marketing/social-posts`),
        axios.get(`${API}/marketing/growth-plan`)
      ]);
      
      if (referralRes) setReferralData(referralRes.data);
      setSocialPosts(postsRes.data.posts || []);
      setGrowthPlan(planRes.data);
    } catch (error) {
      console.error('Error fetching marketing data:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const shareOnPlatform = (platform, message) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralData?.referral_link || '')}&summary=${encodeURIComponent(message)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] pb-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-4">
            <Rocket className="w-4 h-4 mr-2" />Marketing Warfare System
          </Badge>
          <h1 className="text-4xl font-bold mb-2">Sell 1000 Tickets This Month</h1>
          <p className="text-slate-500">Automated marketing tools to dominate the competition</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Users className="w-4 h-4" />Referrals
            </div>
            <div className="text-3xl font-bold">{referralData?.stats?.total_referrals || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <DollarSign className="w-4 h-4" />Earnings
            </div>
            <div className="text-3xl font-bold text-emerald-600">€{referralData?.stats?.total_earnings || 0}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Target className="w-4 h-4" />Target
            </div>
            <div className="text-3xl font-bold text-violet-600">1000</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <TrendingUp className="w-4 h-4" />Progress
            </div>
            <div className="text-3xl font-bold text-amber-600">0%</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Referral Program */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Viral Referral Program</h2>
                <p className="text-slate-500 text-sm">Give €10, Get €10 for each friend</p>
              </div>
            </div>

            {referralData && (
              <>
                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <label className="text-slate-500 text-sm mb-2 block">Your Referral Link</label>
                  <div className="flex gap-2">
                    <input 
                      value={referralData.referral_link}
                      readOnly
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm"
                    />
                    <Button 
                      onClick={() => copyToClipboard(referralData.referral_link, 'link')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {copiedField === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  <Button 
                    onClick={() => shareOnPlatform('twitter', referralData.share_messages.twitter)}
                    className="bg-[#1DA1F2] hover:bg-[#1a8cd8]"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => shareOnPlatform('facebook', referralData.share_messages.facebook)}
                    className="bg-[#4267B2] hover:bg-[#365899]"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => shareOnPlatform('linkedin', referralData.share_messages.linkedin)}
                    className="bg-[#0077B5] hover:bg-[#006396]"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => shareOnPlatform('whatsapp', referralData.share_messages.whatsapp)}
                    className="bg-[#25D366] hover:bg-[#20bd5a]"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-sm text-slate-500">
                  Code: <span className="text-violet-600 font-mono">{referralData.referral_code}</span>
                </div>
              </>
            )}

            {!user && (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">Sign in to get your referral link</p>
                <Link to="/">
                  <Button className="bg-purple-600 hover:bg-purple-700">Sign In</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Social Media Posts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Auto-Generated Posts</h2>
                <p className="text-slate-500 text-sm">Copy & paste to your social media</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {socialPosts.map((post, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`
                      ${post.platform === 'twitter' ? 'bg-[#1DA1F2]' : ''}
                      ${post.platform === 'facebook' ? 'bg-[#4267B2]' : ''}
                      ${post.platform === 'instagram' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                      ${post.platform === 'linkedin' ? 'bg-[#0077B5]' : ''}
                      text-white
                    `}>
                      {post.platform}
                    </Badge>
                    <span className="text-slate-400 text-sm">{post.event_title}</span>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3">{post.content}</p>
                  <Button 
                    size="sm"
                    onClick={() => copyToClipboard(post.content, `post-${idx}`)}
                    className="bg-zinc-700 hover:bg-zinc-600"
                  >
                    {copiedField === `post-${idx}` ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    Copy
                  </Button>
                </div>
              ))}
            </div>

            <Button 
              onClick={fetchData}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />Generate New Posts
            </Button>
          </div>

          {/* Monthly Growth Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">4-Week Growth Plan</h2>
                <p className="text-slate-500 text-sm">Follow this plan to sell 1000 tickets</p>
              </div>
            </div>

            {growthPlan && (
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(growthPlan.monthly_plan)
                  .filter(([key]) => key.startsWith('week'))
                  .map(([weekKey, week]) => (
                    <div key={weekKey} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-violet-50 text-violet-600 border-violet-200">
                          {weekKey.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-emerald-600 font-bold">{week.target_sales} sales</span>
                      </div>
                      <h3 className="font-bold mb-2">{week.focus}</h3>
                      <ul className="space-y-1">
                        {week.actions.slice(0, 3).map((action, idx) => (
                          <li key={idx} className="text-sm text-slate-500 flex items-start gap-2">
                            <ChevronRight className="w-3 h-3 mt-1 text-violet-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Growth Tactics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Growth Hacking Tactics</h2>
                <p className="text-slate-500 text-sm">Proven strategies to boost sales</p>
              </div>
            </div>

            <div className="space-y-3">
              {growthPlan?.growth_tactics?.slice(0, 6).map((tactic, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    tactic.potential_impact === 'high' ? 'bg-emerald-50 text-emerald-600' :
                    tactic.potential_impact === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-zinc-500/20 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{tactic.name}</h4>
                    <p className="text-sm text-slate-500">{tactic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Value Keywords */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Target Keywords</h2>
                <p className="text-slate-500 text-sm">Focus content on these keywords</p>
              </div>
            </div>

            <div className="space-y-2">
              {growthPlan?.high_value_keywords?.map((kw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm">{kw.keyword}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{kw.volume?.toLocaleString()} searches</span>
                    <Badge className={`text-xs ${
                      kw.difficulty === 'low' ? 'bg-emerald-50 text-emerald-600' :
                      kw.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {kw.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link to="/seo-dashboard" className="block">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
              <Megaphone className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-1">SEO Dashboard</h3>
              <p className="text-purple-200 text-sm">Submit URLs to search engines</p>
            </div>
          </Link>
          <Link to="/events" className="block">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <BarChart3 className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-1">Browse Events</h3>
              <p className="text-blue-200 text-sm">Share events on social media</p>
            </div>
          </Link>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
              <ExternalLink className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-1">Analytics</h3>
              <p className="text-amber-200 text-sm">Track your traffic & sales</p>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
};

export default MarketingDashboard;
