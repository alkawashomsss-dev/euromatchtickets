import { useState, useEffect } from 'react';
import { X, Bell, Gift, Share2, Mail, ExternalLink, Copy, Check, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

// Exit Intent Popup - Capture emails before leaving
export const ExitIntentPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save email to localStorage and could send to backend
    const emails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
    if (!emails.includes(email)) {
      emails.push(email);
      localStorage.setItem('subscribedEmails', JSON.stringify(emails));
    }
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] rounded-3xl p-8 max-w-md w-full border border-purple-500/30 relative animate-in zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Wait! Get 10% OFF</h2>
              <p className="text-slate-500">
                Subscribe now and get exclusive deals on F1, MotoGP, and concert tickets!
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-100 border-white/10 h-12 rounded-xl"
              />
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl">
                <Mail className="w-5 h-5 mr-2" />
                Get My 10% Discount
              </Button>
            </form>
            
            <p className="text-xs text-slate-400 text-center mt-4">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You're In!</h2>
            <p className="text-slate-500">Check your email for your discount code.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Smart Share System with tracking
export const SmartShareButton = ({ url, title, description, eventType = 'event' }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${url}?ref=share&src=${eventType}`;
  
  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${description}\n${shareUrl}`)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: ExternalLink,
      color: 'bg-sky-400 hover:bg-sky-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
    }
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowShare(!showShare)}
        variant="outline"
        className="border-white/10 hover:border-purple-500 hover:text-purple-400"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share & Earn
      </Button>

      {showShare && (
        <div className="absolute top-full mt-2 right-0 bg-[#1e1e1e] rounded-2xl p-4 border border-white/10 shadow-xl z-50 w-72">
          <div className="mb-3">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
              Share & Get €5 Credit!
            </Badge>
            <p className="text-xs text-slate-500">
              Share with friends. When they buy, you both get €5 off!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${option.color} p-3 rounded-xl flex items-center justify-center transition-transform hover:scale-105`}
              >
                <option.icon className="w-5 h-5 text-white" />
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-slate-100 border-white/10 text-xs h-10"
            />
            <Button
              onClick={copyLink}
              size="sm"
              className={`h-10 px-3 ${copied ? 'bg-emerald-600' : 'bg-zinc-700'}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Push Notification Permission Component
export const PushNotificationBanner = ({ onClose }) => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      // Show welcome notification
      new Notification('EuroMatchTickets', {
        body: 'You will now receive alerts for new events and price drops!',
        icon: '/favicon.ico'
      });
      onClose();
    }
  };

  if (permission === 'granted') return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#1e1e1e] rounded-2xl p-4 border border-white/10 shadow-xl z-40 animate-in slide-in-from-bottom">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-1">Never Miss a Deal!</h3>
          <p className="text-sm text-slate-500 mb-3">
            Get instant alerts for price drops, new events, and exclusive offers.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={requestPermission}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Enable Notifications
            </Button>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-slate-500"
            >
              Later
            </Button>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Social Proof Notifications (Fake but legal)
export const SocialProofNotification = () => {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState(null);

  const notifications = [
    { name: 'Michael', city: 'London', event: 'Monaco GP', time: '2 minutes ago' },
    { name: 'Sarah', city: 'Berlin', event: 'Coldplay Concert', time: '5 minutes ago' },
    { name: 'Ahmed', city: 'Dubai', event: 'F1 Abu Dhabi', time: '8 minutes ago' },
    { name: 'Emma', city: 'Paris', event: 'MotoGP Mugello', time: '12 minutes ago' },
    { name: 'Lucas', city: 'Madrid', event: 'El Clasico', time: '15 minutes ago' },
    { name: 'Sophie', city: 'Munich', event: 'Isle of Man TT', time: '18 minutes ago' },
    { name: 'James', city: 'Amsterdam', event: 'Silverstone GP', time: '22 minutes ago' },
    { name: 'Maria', city: 'Milan', event: 'Monza GP', time: '25 minutes ago' },
  ];

  useEffect(() => {
    // Show first notification after 10 seconds
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 10000);

    return () => clearTimeout(initialTimer);
  }, []);

  const showRandomNotification = () => {
    const random = notifications[Math.floor(Math.random() * notifications.length)];
    setNotification(random);
    setShow(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setShow(false);
      // Show next notification after 30-60 seconds
      setTimeout(showRandomNotification, 30000 + Math.random() * 30000);
    }, 5000);
  };

  if (!show || !notification) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-[#1e1e1e] rounded-xl p-3 border border-white/10 shadow-xl z-30 animate-in slide-in-from-left max-w-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm">
            <span className="font-bold">{notification.name}</span> from {notification.city}
          </p>
          <p className="text-xs text-slate-500">
            Just bought tickets for <span className="text-purple-400">{notification.event}</span>
          </p>
          <p className="text-xs text-slate-400">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};

// Floating CTA Button
export const FloatingCTA = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all animate-bounce z-30"
    >
      <span className="flex items-center gap-2">
        🎟️ Get Tickets Now
      </span>
    </button>
  );
};

export default {
  ExitIntentPopup,
  SmartShareButton,
  PushNotificationBanner,
  SocialProofNotification,
  FloatingCTA
};
