import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Ticket, ChevronRight, Trophy, Music, Flag, Loader2, Star, Shield, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import axios from 'axios';
import { API } from '../App';

// City data with keywords
const CITIES_DATA = {
  'london': { country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', emoji: '🇬🇧' },
  'paris': { country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200', emoji: '🇫🇷' },
  'berlin': { country: 'Germany', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200', emoji: '🇩🇪' },
  'madrid': { country: 'Spain', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', emoji: '🇪🇸' },
  'barcelona': { country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200', emoji: '🇪🇸' },
  'munich': { country: 'Germany', image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=1200', emoji: '🇩🇪' },
  'milan': { country: 'Italy', image: 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=1200', emoji: '🇮🇹' },
  'amsterdam': { country: 'Netherlands', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200', emoji: '🇳🇱' },
  'monaco': { country: 'Monaco', image: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=1200', emoji: '🇲🇨' },
  'rome': { country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200', emoji: '🇮🇹' },
  'vienna': { country: 'Austria', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200', emoji: '🇦🇹' },
  'lisbon': { country: 'Portugal', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200', emoji: '🇵🇹' },
  'manchester': { country: 'UK', image: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?w=1200', emoji: '🇬🇧' },
  'dubai': { country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', emoji: '🇦🇪' },
  'singapore': { country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200', emoji: '🇸🇬' },
};

const CityTicketsPage = () => {
  const { cityName } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState(null);

  const city = cityName?.replace('-tickets', '').replace(/-/g, ' ') || '';
  const cityKey = city.toLowerCase();
  const cityInfo = CITIES_DATA[cityKey] || { country: 'Europe', emoji: '🌍' };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [cityName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch events for this city
      const eventsRes = await axios.get(`${API}/events?city=${city}`);
      setEvents(eventsRes.data || []);

      // Fetch SEO data
      const seoRes = await axios.get(`${API}/seo/city/${city}`);
      setSeoData(seoRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Events in ${city}`,
    "description": `Buy tickets for events in ${city}, ${cityInfo.country}. Football, concerts, F1 and more.`,
    "url": `https://euromatchtickets.com/${cityKey}-tickets`
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title={`${city} Event Tickets 2026 | Football, Concerts, F1 | EuroMatchTickets`}
        description={`Buy tickets for events in ${city}, ${cityInfo.country}. Football matches, concerts, F1 races. Best prices, 100% guarantee. From €29. Instant delivery!`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <Header />

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${cityInfo.image || ''})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 text-center">
          <Badge className="bg-violet-50 text-violet-600 border-violet-200 mb-4">
            <MapPin className="w-4 h-4 mr-2" />{cityInfo.country}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {cityInfo.emoji} {city} Event Tickets
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            Find tickets for football matches, concerts, and motorsport events in {city}. 
            Best prices guaranteed with instant delivery!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to={`/events?city=${city}&type=match`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Trophy className="w-5 h-5 mr-2" />Football Tickets
              </Button>
            </Link>
            <Link to={`/events?city=${city}&type=concert`}>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Music className="w-5 h-5 mr-2" />Concert Tickets
              </Button>
            </Link>
            <Link to="/f1-tickets">
              <Button variant="outline" className="border-red-500/50 text-red-600 hover:bg-red-50">
                <Flag className="w-5 h-5 mr-2" />F1 Tickets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-4 h-4" />100% Guarantee</div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-4 h-4" />Instant Delivery</div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-4 h-4" />4.9/5 Rating</div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Upcoming Events in {city}</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-lg mb-4">No events currently in {city}</p>
              <Link to="/events">
                <Button className="bg-purple-600 hover:bg-purple-700">Browse All Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 12).map((event) => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.event_id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-purple-500/50 transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
                    <Badge className="absolute top-3 left-3 bg-white/90">
                      {event.event_type === 'match' ? '⚽ Football' : event.event_type === 'concert' ? '🎵 Concert' : '🏎️ Motorsport'}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-violet-600 transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-bold">From €{event.min_price || 49}</span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Why Buy {city} Tickets from EuroMatchTickets?</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-500 mb-4">
              EuroMatchTickets is your trusted source for event tickets in {city}, {cityInfo.country}. 
              Whether you're looking for football matches at the city's top stadiums, the hottest concerts, 
              or thrilling motorsport events, we've got you covered.
            </p>
            <ul className="space-y-2 text-slate-500">
              <li>✅ Best prices - typically 20-30% cheaper than other sites</li>
              <li>✅ 100% money-back guarantee if event is cancelled</li>
              <li>✅ Instant delivery via email QR code</li>
              <li>✅ Secure payment with Stripe</li>
              <li>✅ 24/7 customer support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Explore Other Cities</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CITIES_DATA)
              .filter(([key]) => key !== cityKey)
              .slice(0, 10)
              .map(([key, info]) => (
                <Link
                  key={key}
                  to={`/${key}-tickets`}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-purple-500/50 px-4 py-2 rounded-full transition-colors"
                >
                  {info.emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CityTicketsPage;
