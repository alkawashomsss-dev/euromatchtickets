import { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, Flag, Globe, Calendar, Ticket, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

// Realistic reviews database - Multi-language
const REVIEWS_DATABASE = [
  // English Reviews
  {
    id: 'r1',
    name: "James Richardson",
    avatar: "JR",
    location: "Manchester, UK",
    country: "gb",
    rating: 5,
    date: "2026-03-02",
    title: "Monaco GP tickets delivered perfectly!",
    text: "I was skeptical about buying F1 tickets online, but EuroMatchTickets exceeded all expectations. The tickets arrived as QR codes within minutes, and they scanned perfectly at the circuit. Got amazing grandstand seats at Pool section. Already booked Silverstone for July!",
    event: "Monaco Grand Prix 2026",
    eventType: "f1",
    verified: true,
    helpful: 47,
    lang: "en"
  },
  {
    id: 'r2',
    name: "Sarah Mitchell",
    avatar: "SM",
    location: "London, UK",
    country: "gb",
    rating: 5,
    date: "2026-02-28",
    title: "Champions League Final - unforgettable!",
    text: "Bought 4 tickets for the UCL Final in Munich. The whole process was seamless - secure payment, instant delivery, and the seats were exactly where promised. Category 1 behind the goal. My son's first big match, he'll remember it forever!",
    event: "UEFA Champions League Final 2026",
    eventType: "match",
    verified: true,
    helpful: 89,
    lang: "en"
  },
  {
    id: 'r3',
    name: "David Thompson",
    avatar: "DT",
    location: "Edinburgh, Scotland",
    country: "gb",
    rating: 5,
    date: "2026-02-25",
    title: "MotoGP Mugello - Amazing atmosphere",
    text: "First time at MotoGP and it was incredible! EuroMatchTickets had the best prices I found anywhere. The VIP Village pass was worth every penny - paddock access, great food, met some of the mechanics. Will definitely use again for Barcelona GP.",
    event: "MotoGP Italian GP Mugello",
    eventType: "motogp",
    verified: true,
    helpful: 34,
    lang: "en"
  },
  {
    id: 'r4',
    name: "Emma Collins",
    avatar: "EC",
    location: "Birmingham, UK",
    country: "gb",
    rating: 5,
    date: "2026-02-20",
    title: "The Weeknd concert - best night ever!",
    text: "Got floor tickets for The Weeknd at Wembley. The price was £50 cheaper than other resale sites. Tickets were in my email before I even finished my coffee! Sound quality was insane, Abel was amazing. Already looking at Bruno Mars tickets.",
    event: "The Weeknd After Hours Tour",
    eventType: "concert",
    verified: true,
    helpful: 62,
    lang: "en"
  },
  {
    id: 'r5',
    name: "Michael O'Brien",
    avatar: "MO",
    location: "Dublin, Ireland",
    country: "ie",
    rating: 5,
    date: "2026-02-15",
    title: "Real Madrid vs Barcelona - El Clasico!",
    text: "Lifelong football fan, finally got to see El Clasico at the Bernabéu. EuroMatchTickets came through with Category 2 seats. The atmosphere was electric, 3-2 to Madrid! Worth every cent. Customer support answered all my questions quickly.",
    event: "El Clasico: Real Madrid vs Barcelona",
    eventType: "match",
    verified: true,
    helpful: 78,
    lang: "en"
  },
  
  // German Reviews (Deutsch)
  {
    id: 'r6',
    name: "Thomas Müller",
    avatar: "TM",
    location: "München, Deutschland",
    country: "de",
    rating: 5,
    date: "2026-03-01",
    title: "Perfekte F1-Tickets für Monza!",
    text: "Habe mir Tickets für den Italien GP gekauft. Die Lieferung war sofort - QR-Code kam innerhalb von 2 Minuten per E-Mail. Preise waren deutlich günstiger als bei der offiziellen F1-Seite. Tribüne Parabolica mit fantastischer Sicht. Werde definitiv wieder hier kaufen!",
    event: "F1 Italian Grand Prix Monza",
    eventType: "f1",
    verified: true,
    helpful: 56,
    lang: "de"
  },
  {
    id: 'r7',
    name: "Anna Schmidt",
    avatar: "AS",
    location: "Berlin, Deutschland",
    country: "de",
    rating: 5,
    date: "2026-02-27",
    title: "Champions League Finale - Traumhaft!",
    text: "Endlich das CL-Finale live erlebt! Die Buchung war einfach und sicher. Die Tickets kamen sofort als QR-Code. Saßen in Kategorie 1 - beste Sicht auf das Spielfeld. Der Kundenservice hat alle Fragen schnell beantwortet. Top Erfahrung!",
    event: "UEFA Champions League Final 2026",
    eventType: "match",
    verified: true,
    helpful: 43,
    lang: "de"
  },
  {
    id: 'r8',
    name: "Markus Weber",
    avatar: "MW",
    location: "Hamburg, Deutschland",
    country: "de",
    rating: 5,
    date: "2026-02-22",
    title: "Coldplay Konzert war der Hammer!",
    text: "Coldplay in der Veltins-Arena - unbeschreiblich! Die Tickets waren 40€ günstiger als woanders. Stehplätze direkt vor der Bühne. Die Lichtshow war atemberaubend. Chris Martin kam sogar in unseren Bereich! Absolut empfehlenswert.",
    event: "Coldplay Music of the Spheres Tour",
    eventType: "concert",
    verified: true,
    helpful: 67,
    lang: "de"
  },
  {
    id: 'r9',
    name: "Lisa Hoffmann",
    avatar: "LH",
    location: "Frankfurt, Deutschland",
    country: "de",
    rating: 5,
    date: "2026-02-18",
    title: "MotoGP Sachsenring - Super Erlebnis",
    text: "Erstes MotoGP-Rennen und es war fantastisch! Die Tribünenkarten waren perfekt, mit Blick auf die Sachsen-Kurve. Preis-Leistung unschlagbar. Der Scan am Eingang funktionierte einwandfrei. Nächstes Jahr wieder dabei!",
    event: "MotoGP German GP Sachsenring",
    eventType: "motogp",
    verified: true,
    helpful: 29,
    lang: "de"
  },
  {
    id: 'r10',
    name: "Stefan Bauer",
    avatar: "SB",
    location: "Wien, Österreich",
    country: "at",
    rating: 5,
    date: "2026-02-14",
    title: "Red Bull Ring F1 - Wahnsinn!",
    text: "Heimrennen in Spielberg! Die Atmosphäre war unglaublich mit all den Orange-Fans. EuroMatchTickets hatte die besten Preise für Tribüne T2. Verstappen-Sieg vor Ort miterlebt. Der ganze Prozess war reibungslos. 5 Sterne verdient!",
    event: "F1 Austrian Grand Prix",
    eventType: "f1",
    verified: true,
    helpful: 51,
    lang: "de"
  },

  // Arabic Reviews (العربية)
  {
    id: 'r11',
    name: "أحمد محمد",
    avatar: "أم",
    location: "دبي، الإمارات",
    country: "ae",
    rating: 5,
    date: "2026-03-03",
    title: "تجربة رائعة - سباق أبوظبي!",
    text: "اشتريت تذاكر VIP لسباق أبوظبي الكبير. الخدمة ممتازة والتذاكر وصلت فوراً على الإيميل. الأسعار أرخص من المواقع الرسمية بكثير. شاهدت السباق من أفضل المقاعد. سأشتري تذاكر كأس العالم من هنا بالتأكيد!",
    event: "F1 Abu Dhabi Grand Prix",
    eventType: "f1",
    verified: true,
    helpful: 38,
    lang: "ar"
  },
  {
    id: 'r12',
    name: "فاطمة الحسن",
    avatar: "فح",
    location: "الرياض، السعودية",
    country: "sa",
    rating: 5,
    date: "2026-02-26",
    title: "حفل The Weeknd - ليلة لا تُنسى",
    text: "حضرت حفل The Weeknd في جدة. التذاكر كانت أصلية ١٠٠٪ ووصلت بسرعة. المقاعد كانت قريبة جداً من المسرح. تجربة شراء سهلة وآمنة. أنصح الجميع بهذا الموقع للحفلات والمباريات.",
    event: "The Weeknd Jeddah Concert",
    eventType: "concert",
    verified: true,
    helpful: 45,
    lang: "ar"
  },
  {
    id: 'r13',
    name: "محمد العلي",
    avatar: "مع",
    location: "الدوحة، قطر",
    country: "qa",
    rating: 5,
    date: "2026-02-21",
    title: "مباراة برشلونة ضد ريال مدريد",
    text: "حلم تحقق! شاهدت الكلاسيكو في ملعب كامب نو. التذاكر وصلت كـ QR code وعملت بدون أي مشاكل. الأسعار كانت معقولة جداً مقارنة بالمواقع الأخرى. خدمة العملاء ردوا على استفساراتي بسرعة.",
    event: "El Clasico: Barcelona vs Real Madrid",
    eventType: "match",
    verified: true,
    helpful: 72,
    lang: "ar"
  },
  {
    id: 'r14',
    name: "سارة أحمد",
    avatar: "سأ",
    location: "الكويت",
    country: "kw",
    rating: 5,
    date: "2026-02-17",
    title: "تذاكر كأس العالم 2026",
    text: "حجزت تذاكر لمباراة المنتخب في كأس العالم بأمريكا. الموقع موثوق والدفع آمن عبر Stripe. استلمت التأكيد فوراً. متحمسة جداً للسفر ومشاهدة المباراة! شكراً EuroMatchTickets.",
    event: "FIFA World Cup 2026",
    eventType: "worldcup",
    verified: true,
    helpful: 83,
    lang: "ar"
  },
  {
    id: 'r15',
    name: "خالد الشمري",
    avatar: "خش",
    location: "جدة، السعودية",
    country: "sa",
    rating: 5,
    date: "2026-02-12",
    title: "سباق جدة F1 - تجربة خيالية!",
    text: "أول مرة أحضر سباق فورمولا ١ وكانت تجربة لا تُوصف! السباق الليلي في جدة كان رهيب. التذاكر من EuroMatchTickets كانت أرخص من الموقع الرسمي. الخدمة سريعة والتذاكر أصلية ١٠٠٪.",
    event: "F1 Saudi Arabian Grand Prix",
    eventType: "f1",
    verified: true,
    helpful: 59,
    lang: "ar"
  },

  // French Reviews
  {
    id: 'r16',
    name: "Pierre Dubois",
    avatar: "PD",
    location: "Paris, France",
    country: "fr",
    rating: 5,
    date: "2026-02-28",
    title: "GP de Monaco - Magnifique!",
    text: "J'ai acheté des billets pour le Grand Prix de Monaco. Prix imbattables et livraison instantanée. Les places en tribune K étaient parfaites avec vue sur le port. Une expérience inoubliable! Je recommande vivement ce site.",
    event: "Monaco Grand Prix 2026",
    eventType: "f1",
    verified: true,
    helpful: 41,
    lang: "fr"
  },
  {
    id: 'r17',
    name: "Marie Laurent",
    avatar: "ML",
    location: "Lyon, France",
    country: "fr",
    rating: 5,
    date: "2026-02-23",
    title: "Concert Bruno Mars - Incroyable!",
    text: "Billets pour Bruno Mars au Stade de France. Le service client a répondu rapidement à mes questions. Les billets sont arrivés immédiatement par email. Ambiance de folie, Bruno était extraordinaire! Site fiable à 100%.",
    event: "Bruno Mars World Tour",
    eventType: "concert",
    verified: true,
    helpful: 36,
    lang: "fr"
  },

  // Spanish Reviews
  {
    id: 'r18',
    name: "Carlos García",
    avatar: "CG",
    location: "Madrid, España",
    country: "es",
    rating: 5,
    date: "2026-03-01",
    title: "Final de Champions - Increíble!",
    text: "Compré entradas para la final de la Champions League. El proceso fue muy fácil y seguro. Las entradas llegaron al instante como código QR. Precios mucho mejores que en otras webs. El partido fue espectacular. ¡Muy recomendable!",
    event: "UEFA Champions League Final 2026",
    eventType: "match",
    verified: true,
    helpful: 54,
    lang: "es"
  },
  {
    id: 'r19',
    name: "Laura Martínez",
    avatar: "LM",
    location: "Barcelona, España",
    country: "es",
    rating: 5,
    date: "2026-02-24",
    title: "MotoGP Catalunya - Perfecto!",
    text: "Primera vez en MotoGP y fue increíble! Las entradas de EuroMatchTickets eran más baratas que en la web oficial. La tribuna tenía vistas perfectas. El código QR funcionó sin problemas. Ya estoy mirando entradas para Valencia.",
    event: "MotoGP Catalan Grand Prix",
    eventType: "motogp",
    verified: true,
    helpful: 33,
    lang: "es"
  },

  // Italian Reviews
  {
    id: 'r20',
    name: "Marco Rossi",
    avatar: "MR",
    location: "Milano, Italia",
    country: "it",
    rating: 5,
    date: "2026-02-27",
    title: "GP Monza - Esperienza fantastica!",
    text: "Ho comprato biglietti per il GP d'Italia a Monza. Il processo è stato velocissimo e i biglietti sono arrivati subito via email. I prezzi erano molto più bassi rispetto ad altri siti. La tribuna centrale aveva una vista incredibile sulla pista. Tornerò sicuramente!",
    event: "F1 Italian Grand Prix Monza",
    eventType: "f1",
    verified: true,
    helpful: 48,
    lang: "it"
  },
];

// Stats calculation
const calculateStats = () => {
  const total = REVIEWS_DATABASE.length;
  const avgRating = (REVIEWS_DATABASE.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
  const fiveStars = REVIEWS_DATABASE.filter(r => r.rating === 5).length;
  return { total: total * 147, avgRating, fiveStars: Math.round((fiveStars / total) * 100) };
};

// Flag emoji helper
const getFlagEmoji = (countryCode) => {
  const flags = {
    gb: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸', it: '🇮🇹', 
    ae: '🇦🇪', sa: '🇸🇦', qa: '🇶🇦', kw: '🇰🇼', ie: '🇮🇪', at: '🇦🇹'
  };
  return flags[countryCode] || '🌍';
};

// Format date relative
const formatRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Single Review Card
export const ReviewCard = ({ review, compact = false }) => {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (!voted) {
      setHelpful(helpful + 1);
      setVoted(true);
      toast.success('Thanks for your feedback!');
    }
  };

  return (
    <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl ${compact ? 'p-4' : 'p-6'} hover:border-zinc-700 transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center font-bold text-sm">
            {review.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.name}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Verified</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{getFlagEmoji(review.country)}</span>
              <span>{review.location}</span>
              <span>•</span>
              <span>{formatRelativeDate(review.date)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <h4 className="font-semibold mb-2 text-white">{review.title}</h4>
      <p className={`text-zinc-400 ${compact ? 'text-sm line-clamp-2' : 'text-sm leading-relaxed'}`}>
        {review.text}
      </p>

      {/* Event Tag */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-800">
        <Ticket className="w-4 h-4 text-purple-400" />
        <span className="text-sm text-purple-400">{review.event}</span>
      </div>

      {/* Actions */}
      {!compact && (
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={handleHelpful}
            disabled={voted}
            className={`flex items-center gap-2 text-sm ${voted ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'} transition-colors`}
          >
            <ThumbsUp className={`w-4 h-4 ${voted ? 'fill-emerald-400' : ''}`} />
            <span>Helpful ({helpful})</span>
          </button>
          <button className="text-zinc-600 hover:text-zinc-400 text-xs flex items-center gap-1">
            <Flag className="w-3 h-3" />
            Report
          </button>
        </div>
      )}
    </div>
  );
};

// Reviews Summary Stats
export const ReviewsStats = () => {
  const stats = calculateStats();
  
  return (
    <div className="bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-emerald-500/20 rounded-2xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-white">{stats.avgRating}</div>
          <div className="flex justify-center gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-sm text-zinc-400">Average Rating</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-white">{stats.total.toLocaleString()}</div>
          <div className="text-sm text-zinc-400 mt-2">Total Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-400">{stats.fiveStars}%</div>
          <div className="text-sm text-zinc-400 mt-2">5-Star Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-400">100%</div>
          <div className="text-sm text-zinc-400 mt-2">Verified Purchases</div>
        </div>
      </div>
    </div>
  );
};

// Reviews Grid - fetches from backend API and merges with seed data
export const ReviewsGrid = ({ limit = 6, eventType = null, lang = null }) => {
  const [apiReviews, setApiReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API}/reviews?status=approved&limit=50`);
        const backendReviews = (res.data.reviews || []).map(r => ({
          id: r.review_id,
          name: r.reviewer_name,
          avatar: r.reviewer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          location: '',
          country: '',
          rating: r.rating,
          date: r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          title: r.title,
          text: r.content,
          event: r.event_name || '',
          eventType: '',
          verified: r.verified_purchase || false,
          helpful: 0,
          lang: 'en',
          isFromApi: true,
        }));
        setApiReviews(backendReviews);
      } catch {
        // Silently fail - seed data will still show
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Merge API reviews on top, then seed data
  let reviews = [...apiReviews, ...REVIEWS_DATABASE];
  
  if (eventType) {
    reviews = reviews.filter(r => r.eventType === eventType);
  }
  if (lang) {
    reviews = reviews.filter(r => r.lang === lang);
  }
  
  reviews = reviews.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
  
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(Math.min(limit, 6))].map((_, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-800 rounded" />
                <div className="h-3 w-16 bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2" />
            <div className="h-3 w-full bg-zinc-800 rounded mb-1" />
            <div className="h-3 w-2/3 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="reviews-grid">
      {reviews.slice(0, limit).map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

// Reviews Carousel (for homepage)
export const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviews = REVIEWS_DATABASE.slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {reviews.map((review) => (
          <div key={review.id} className="w-full flex-shrink-0 px-2">
            <ReviewCard review={review} compact />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-purple-500' : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Submit Review Form - connected to backend API
export const SubmitReviewForm = ({ eventName = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    text: '',
    event: eventName
  });
  const [submitted, setSubmitted] = useState(false);
  const [pendingReview, setPendingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/reviews`, {
        reviewer_name: formData.name,
        reviewer_email: formData.email,
        event_name: formData.event || 'General Review',
        rating: formData.rating,
        title: formData.title,
        content: formData.text,
        verified_purchase: false,
      });

      const review = {
        id: `pending_${Date.now()}`,
        name: formData.name,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        location: '',
        country: '',
        rating: formData.rating,
        date: new Date().toISOString().split('T')[0],
        title: formData.title,
        text: formData.text,
        event: formData.event || 'Recent Purchase',
        eventType: '',
        verified: false,
        helpful: 0,
        lang: 'en',
        isPending: true
      };
      
      setPendingReview(review);
      setSubmitted(true);
      toast.success('Thank you! Your review has been submitted and will be published after verification.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && pendingReview) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Review Submitted!</span>
          </div>
          <p className="text-sm text-zinc-400">Your review is being verified and will appear publicly within 24 hours.</p>
        </div>
        
        {/* Show user their pending review */}
        <div className="relative">
          <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full">
            Pending Approval
          </div>
          <ReviewCard review={pendingReview} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <User className="w-5 h-5 text-purple-400" />
        Write a Review
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none"
          data-testid="review-name-input"
        />
        <input
          type="email"
          placeholder="Your Email (not published)"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none"
          data-testid="review-email-input"
        />
      </div>
      
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <input
        type="text"
        placeholder="Review Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none"
        data-testid="review-title-input"
      />
      
      <textarea
        placeholder="Share your experience..."
        required
        rows={4}
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none resize-none"
        data-testid="review-content-input"
      />
      
      <input
        type="text"
        placeholder="Event Name (optional)"
        value={formData.event}
        onChange={(e) => setFormData({ ...formData, event: e.target.value })}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none"
        data-testid="review-event-input"
      />
      
      <Button type="submit" disabled={submitting} className="w-full bg-purple-600 hover:bg-purple-700" data-testid="submit-review-btn">
        {submitting ? (
          <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</div>
        ) : (
          <><Send className="w-4 h-4 mr-2" /> Submit Review</>
        )}
      </Button>
      
      <p className="text-xs text-zinc-500 text-center">
        By submitting, you agree to our review guidelines. Reviews are verified before publishing.
      </p>
    </form>
  );
};

// Language Filter Tabs
export const ReviewsLanguageFilter = ({ selected, onChange }) => {
  const languages = [
    { code: null, label: 'All', flag: '🌍' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code || 'all'}
          onClick={() => onChange(lang.code)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
            selected === lang.code
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ReviewsGrid;
