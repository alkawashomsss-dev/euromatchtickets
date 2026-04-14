import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Loader2, ArrowRight, Star, Shield, Zap, Trophy, Music, Flag, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHead from '../components/SEOHead';
import axios from 'axios';
import { API } from '../App';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MONTH_HIGHLIGHTS = {
  'January': { events: ['Winter Tours', 'Indoor Concerts'], color: 'from-blue-600 to-cyan-600' },
  'February': { events: ['Valentine Concerts', 'Six Nations Rugby'], color: 'from-pink-600 to-red-600' },
  'March': { events: ['F1 Season Start', 'Spring Tours'], color: 'from-green-600 to-emerald-600' },
  'April': { events: ['Easter Events', 'MotoGP Europe'], color: 'from-purple-600 to-violet-600' },
  'May': { events: ['Monaco GP', 'Champions League Final'], color: 'from-amber-600 to-orange-600' },
  'June': { events: ['Summer Festivals', 'Euro Championships'], color: 'from-yellow-500 to-amber-500' },
  'July': { events: ['British GP', 'Tour de France'], color: 'from-red-600 to-rose-600' },
  'August': { events: ['Festival Season Peak', 'Summer Concerts'], color: 'from-orange-500 to-red-500' },
  'September': { events: ['Singapore GP Night Race', 'Football Season'], color: 'from-indigo-600 to-purple-600' },
  'October': { events: ['Japan GP', 'Halloween Events'], color: 'from-orange-600 to-amber-600' },
  'November': { events: ['Las Vegas GP', 'End of Season'], color: 'from-purple-600 to-pink-600' },
  'December': { events: ['Abu Dhabi GP Final', 'Christmas Concerts'], color: 'from-red-600 to-green-600' },
};

const MonthlyEventsPage = ({ month = 'January' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const monthIndex = MONTHS.indexOf(month);
  const monthData = MONTH_HIGHLIGHTS[month] || MONTH_HIGHLIGHTS['January'];
  const prevMonth = monthIndex > 0 ? MONTHS[monthIndex - 1] : MONTHS[11];
  const nextMonth = monthIndex < 11 ? MONTHS[monthIndex + 1] : MONTHS[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMonthEvents();
  }, [month]);

  const fetchMonthEvents = async () => {
    setLoading(true);
    try {
      // Calculate month start and end
      const year = 2026;
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0);

      const res = await axios.get(`${API}/events`, {
        params: {
          date_from: startDate.toISOString().split('T')[0],
          date_to: endDate.toISOString().split('T')[0]
        }
      });
      setEvents(res.data || []);
    } catch (error) {
      console.error('Error fetching monthly events:', error);
      // Fallback: fetch all events
      try {
        const res = await axios.get(`${API}/events`);
        setEvents((res.data || []).slice(0, 12));
      } catch (e) {
        console.error('Fallback error:', e);
      }
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'match': return <Trophy className="w-4 h-4" />;
      case 'concert': return <Music className="w-4 h-4" />;
      case 'f1': case 'motogp': return <Flag className="w-4 h-4" />;
      default: return <Ticket className="w-4 h-4" />;
    }
  };

  const getEventBadge = (type) => {
    switch(type) {
      case 'match': return { text: 'Football', color: 'bg-emerald-500/100/90' };
      case 'concert': return { text: 'Concert', color: 'bg-purple-500/100/90' };
      case 'f1': return { text: 'F1', color: 'bg-[#e10600]/100/90' };
      case 'motogp': return { text: 'MotoGP', color: 'bg-orange-500/100/90' };
      default: return { text: 'Event', color: 'bg-zinc-500/90' };
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Events in ${month} 2026`,
    "description": `Find all events happening in ${month} 2026. Football, concerts, F1 races.`
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Monthly Events", url: "https://euromatchtickets.com/events-this-month" }]} />
      <SEOHead 
        title={`Events in ${month} 2026 - Football, Concerts, F1`}
        description={`Find all events happening in ${month} 2026. Football, concerts, F1 races. Book now with best prices!`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${monthData.color} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-slate-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 text-center">
          {/* Month Navigation */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link to={`/events-${prevMonth.toLowerCase()}-2026`}>
              <Button variant="outline" size="sm" className="border-white/10">
                <ChevronLeft className="w-4 h-4 mr-1" />{prevMonth}
              </Button>
            </Link>
            <Badge className={`bg-gradient-to-r ${monthData.color} text-white border-0 px-4 py-1`}>
              <Calendar className="w-4 h-4 mr-2" />2026
            </Badge>
            <Link to={`/events-${nextMonth.toLowerCase()}-2026`}>
              <Button variant="outline" size="sm" className="border-white/10">
                {nextMonth}<ChevronRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Events in {month} 2026
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            {monthData.events.join(', ')} and more! Book your tickets now for the best prices.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events?type=match">
              <Button variant="outline" className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10">
                <Trophy className="w-5 h-5 mr-2" />Football
              </Button>
            </Link>
            <Link to="/events?type=concert">
              <Button variant="outline" className="border-purple-500/50 text-violet-600 hover:bg-violet-50">
                <Music className="w-5 h-5 mr-2" />Concerts
              </Button>
            </Link>
            <Link to="/f1-tickets">
              <Button variant="outline" className="border-red-500/50 text-red-600 hover:bg-[#e10600]/10">
                <Flag className="w-5 h-5 mr-2" />F1
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-4 h-4" />100% Guarantee</div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-4 h-4" />Instant Delivery</div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-4 h-4" />Best Prices</div>
          </div>
        </div>
      </section>

      {/* Month Highlights */}
      <section className="py-12 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{month} 2026 Highlights</h2>
          <div className="flex flex-wrap gap-3">
            {monthData.events.map((event, idx) => (
              <Badge key={idx} className={`bg-gradient-to-r ${monthData.color} text-white border-0 px-4 py-2`}>
                {event}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{month} Events</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-[#15151e] rounded-none border border-white/10">
              <Calendar className="w-16 h-16 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-500 text-lg mb-4">No events scheduled for {month} 2026 yet</p>
              <p className="text-slate-400 mb-6">Check back soon or browse other months</p>
              <Link to="/events">
                <Button className="bg-purple-600 hover:bg-purple-700">Browse All Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const badgeInfo = getEventBadge(event.event_type);
                return (
                  <Link
                    key={event.event_id}
                    to={`/event/${event.slug || event.event_id}`}
                    className="group bg-[#1e1e1e] rounded-none overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
                    data-testid={`monthly-event-${event.event_id}`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={event.event_image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900" />
                      <Badge className={`absolute top-3 left-3 ${badgeInfo.color} text-white`}>
                        {getEventIcon(event.event_type)}
                        <span className="ml-1">{badgeInfo.text}</span>
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-violet-600 transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.event_date)}</span>
                        <span>|</span>
                        <MapPin className="w-4 h-4" />
                        <span>{event.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 font-bold">From €{event.lowest_price || 49}</span>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* All Months */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Browse by Month</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {MONTHS.map((m) => (
              <Link 
                key={m}
                to={`/events-${m.toLowerCase()}-2026`}
                className={`text-center py-3 px-4 rounded-none transition-colors ${
                  m === month 
                    ? `bg-gradient-to-r ${monthData.color} text-white` 
                    : 'bg-[#15151e] hover:bg-white/10 border border-white/10 hover:border-purple-500/50'
                }`}
              >
                {m.slice(0, 3)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-slate-500 mb-6">Secure your tickets now with 0% buyer fees and instant delivery.</p>
          <Link to="/events">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700">
              Browse All Events <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MonthlyEventsPage;
