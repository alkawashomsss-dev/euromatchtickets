import { useState, useEffect } from 'react';
import { X, Sparkles, Copy, Check, RefreshCw, Twitter, Facebook, Instagram, Linkedin, Hash, TrendingUp, Target, Zap, Send, Calendar, Globe, MessageSquare, Bot, Rocket, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const API = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '') || '';

// AI Marketing Bot Component
const AIMarketingBot = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('social');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [generatedContent, setGeneratedContent] = useState({
    twitter: [],
    facebook: [],
    instagram: [],
    hashtags: [],
    seoKeywords: [],
    emailSubjects: []
  });

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/api/events`);
        const data = await res.json();
        setEvents(data.slice(0, 20));
        if (data.length > 0) setSelectedEvent(data[0].title);
      } catch (e) {
        console.error('Error fetching events:', e);
      }
    };
    if (isOpen) fetchEvents();
  }, [isOpen]);

  // Generate content based on event
  const generateContent = async () => {
    setGenerating(true);
    
    // Simulate AI generation (in production, this would call OpenAI API)
    await new Promise(r => setTimeout(r, 1500));
    
    const event = events.find(e => e.title === selectedEvent) || { title: selectedEvent, city: 'Europe' };
    const eventType = event.event_type || 'event';
    
    // Twitter posts
    const twitterPosts = [
      `🎫 ${event.title} tickets now available! Get yours before they sell out 🔥\n\n✅ Market pricing may vary\n✅ Instant delivery\n✅ Secure checkout\n\n👉 euromatchtickets.com\n\n#${eventType.toUpperCase()} #Tickets #Europe`,
      `🚀 Don't miss ${event.title}!\n\nTickets from €${Math.floor(Math.random() * 50) + 49} 💰\n\n⚡ Limited availability\n📍 ${event.city || 'Europe'}\n\nBook now: euromatchtickets.com\n\n#LiveEvents #${eventType}`,
      `⏰ LAST CHANCE! ${event.title} tickets selling fast!\n\n🎟️ Secure your spot now\n💳 Safe payment\n📧 Instant confirmation\n\neuromatchtickets.com\n\n#Tickets #MustSee`
    ];
    
    // Facebook posts
    const facebookPosts = [
      `🎉 Exciting news! Tickets for ${event.title} are now available on EuroMatchTickets!\n\n🌟 Why book with us?\n✅ Best prices in Europe\n✅ 100% ticket guarantee\n✅ Instant QR code delivery\n✅ Secure payment with Stripe\n\nDon't wait - these tickets won't last!\n\n👉 www.euromatchtickets.com`,
      `📣 Attention ${eventType === 'f1' ? 'F1' : eventType === 'motogp' ? 'MotoGP' : eventType === 'concert' ? 'music' : 'sports'} fans!\n\n${event.title} is coming and we have tickets!\n\n💰 Prices starting from €${Math.floor(Math.random() * 50) + 49}\n🎫 All categories available\n🔒 Safe & secure booking\n\nTag someone who needs to see this! 👇\n\nBook now at euromatchtickets.com`
    ];
    
    // Instagram captions
    const instagramPosts = [
      `${event.title} 🔥\n\nTickets available NOW! Link in bio 👆\n\n#${eventType} #tickets #europe #liveevents #${event.city?.toLowerCase() || 'travel'} #bucketlist #experiences`,
      `Who's ready for ${event.title}? 🙋‍♂️\n\nGet your tickets at euromatchtickets.com\n\n💫 Best prices\n⚡ Instant delivery\n🎫 100% guarantee\n\n#eurotrip #${eventType}life #ticketmaster #events`
    ];
    
    // Trending hashtags
    const hashtags = [
      `#${eventType.toUpperCase()}`, '#Tickets', '#Europe', '#LiveEvents', 
      '#TravelEurope', `#${event.city || 'Events'}`, '#BucketList', 
      '#WeekendPlans', '#MustSee', '#EventTickets', '#ConcertTickets',
      '#SportsTickets', '#F1', '#MotoGP', '#Football', '#ChampionsLeague'
    ];
    
    // SEO Keywords
    const seoKeywords = [
      `${event.title} tickets`,
      `${event.title} tickets 2026`,
      `buy ${event.title} tickets`,
      `${event.title} tickets cheap`,
      `${event.title} tickets online`,
      `${eventType} tickets ${event.city || 'europe'}`,
      `best ${eventType} tickets`,
      `${eventType} tickets 2026 prices`
    ];
    
    // Email subject lines
    const emailSubjects = [
      `🎫 ${event.title} Tickets - Limited Availability!`,
      `Don't Miss Out: ${event.title} Tickets Now On Sale`,
      `⚡ Flash Sale: ${event.title} Tickets from €${Math.floor(Math.random() * 50) + 49}`,
      `Your ${event.title} tickets are waiting...`,
      `🔥 Hot Deal: Save 30% on ${event.title} Tickets`
    ];
    
    setGeneratedContent({
      twitter: twitterPosts,
      facebook: facebookPosts,
      instagram: instagramPosts,
      hashtags,
      seoKeywords,
      emailSubjects
    });
    
    setGenerating(false);
  };

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'social', label: 'Social Posts', icon: MessageSquare },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'seo', label: 'SEO Keywords', icon: TrendingUp },
    { id: 'email', label: 'Email Subjects', icon: Send }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-purple-500/30 relative flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Marketing Bot</h2>
              <p className="text-white/70 text-sm">Generate viral content in seconds</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Selector */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-slate-500 mb-1 block">Select Event to Promote</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="bg-slate-100 border-slate-200">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.event_id} value={event.title}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateContent} 
              disabled={generating || !selectedEvent}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-10 mt-5"
            >
              {generating ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Generate Content</>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Social Posts Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* Twitter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Twitter className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-lg">Twitter / X</h3>
                </div>
                <div className="space-y-3">
                  {generatedContent.twitter.map((post, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-sm whitespace-pre-wrap mb-3">{post}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">{post.length}/280 characters</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(post, `twitter-${i}`)}
                          className="h-8"
                        >
                          {copied === `twitter-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          <span className="ml-1">{copied === `twitter-${i}` ? 'Copied!' : 'Copy'}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facebook */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Facebook className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-lg">Facebook</h3>
                </div>
                <div className="space-y-3">
                  {generatedContent.facebook.map((post, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-sm whitespace-pre-wrap mb-3">{post}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(post, `facebook-${i}`)}
                        className="h-8"
                      >
                        {copied === `facebook-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="ml-1">{copied === `facebook-${i}` ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <h3 className="font-bold text-lg">Instagram</h3>
                </div>
                <div className="space-y-3">
                  {generatedContent.instagram.map((post, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-sm whitespace-pre-wrap mb-3">{post}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(post, `instagram-${i}`)}
                        className="h-8"
                      >
                        {copied === `instagram-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="ml-1">{copied === `instagram-${i}` ? 'Copied!' : 'Copy'}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hashtags Tab */}
          {activeTab === 'hashtags' && (
            <div>
              <p className="text-slate-500 mb-4">Copy these trending hashtags to increase your reach:</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {generatedContent.hashtags.map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1 text-sm cursor-pointer hover:bg-purple-500/30"
                    onClick={() => copyToClipboard(tag, `hashtag-${i}`)}
                  >
                    {tag} {copied === `hashtag-${i}` && <Check className="w-3 h-3 ml-1" />}
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={() => copyToClipboard(generatedContent.hashtags.join(' '), 'all-hashtags')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {copied === 'all-hashtags' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                Copy All Hashtags
              </Button>
            </div>
          )}

          {/* SEO Keywords Tab */}
          {activeTab === 'seo' && (
            <div>
              <p className="text-slate-500 mb-4">Use these keywords in your content for better Google ranking:</p>
              <div className="space-y-2">
                {generatedContent.seoKeywords.map((keyword, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>{keyword}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(keyword, `seo-${i}`)}
                    >
                      {copied === `seo-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Subjects Tab */}
          {activeTab === 'email' && (
            <div>
              <p className="text-slate-500 mb-4">High-converting email subject lines:</p>
              <div className="space-y-2">
                {generatedContent.emailSubjects.map((subject, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <span>{subject}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(subject, `email-${i}`)}
                    >
                      {copied === `email-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedContent.twitter.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Ready to Generate</h3>
              <p className="text-slate-500 mb-6">Select an event and click "Generate Content" to create viral marketing posts</p>
              <Badge className="bg-purple-500/20 text-purple-400">
                <Zap className="w-4 h-4 mr-1" /> AI-Powered Content
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Marketing Bot Trigger Button
export const MarketingBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all z-30 flex items-center gap-2"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden md:inline">Marketing Bot</span>
      </button>
      <AIMarketingBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AIMarketingBot;
