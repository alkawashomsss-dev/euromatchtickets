import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, Loader2, ArrowRight, Star, Shield, Zap, Trophy, Music, Flag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHead from '../components/SEOHead';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import axios from 'axios';
import { API } from '../App';

const EventsThisWeekendPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchWeekendEvents();
  }, []);

  const fetchWeekendEvents = async () => {
    setLoading(true);
    try {
      // Calculate this weekend's dates
      const today = new Date();
      const dayOfWeek = today.getDay();
      const friday = new Date(today);
      friday.setDate(today.getDate() + (5 - dayOfWeek + 7) % 7);
      const sunday = new Date(friday);
      sunday.setDate(friday.getDate() + 2);

      const res = await axios.get(`${API}/events`, {
        params: {
          date_from: friday.toISOString().split('T')[0],
          date_to: sunday.toISOString().split('T')[0]
        }
      });
      setEvents(res.data || []);
    } catch (error) {
      console.error('Error fetching weekend events:', error);
      // Fallback: fetch all upcoming events
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

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Events This Weekend",
    "description": "Events happening this weekend - football, concerts, F1 races"
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <BreadcrumbSchema items={[{ name: "Home", url: "https://euromatchtickets.com/" }, { name: "Events This Weekend", url: "https://euromatchtickets.com/events-this-weekend" }]} />
      <SEOHead 
        title="Events This Weekend | EuroMatchTickets"
        description="Find events happening this weekend. Football matches, concerts, motorsport. Book last-minute tickets with instant delivery."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-zinc-950 to-purple-900/20" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 text-center">
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 mb-4">
            <Clock className="w-4 h-4 mr-2" />This Weekend
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Events This Weekend
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            Don't miss out! Book last-minute tickets for this weekend's hottest events.
            Football, concerts, motorsport - QR ticket delivery.
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
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-4 h-4" />Buyer protection</div>
            <div className="flex items-center gap-2 text-emerald-600"><Zap className="w-4 h-4" />QR delivery</div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-4 h-4" />Last-Minute OK</div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Weekend Events</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-[#15151e] rounded-none border border-white/10">
              <Clock className="w-16 h-16 mx-auto text-slate-500 mb-4" />
              <p className="text-slate-500 text-lg mb-4">No events scheduled for this weekend</p>
              <Link to="/events">
                <Button className="bg-purple-600 hover:bg-purple-700">Browse All Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.event_id}
                  to={`/event/${event.slug || event.event_id}`}
                  className="group bg-[#1e1e1e] rounded-none overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all"
                  data-testid={`weekend-event-${event.event_id}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={event.event_image || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900" />
                    <Badge className="absolute top-3 left-3 bg-orange-500/100/90 text-white">
                      {getEventIcon(event.event_type)}
                      <span className="ml-1">This Weekend</span>
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                      <span>|</span>
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-bold">From €{event.lowest_price || 49}</span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Last Minute Tips */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Last-Minute Booking Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1e1e1e] p-6 rounded-none border border-white/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />QR ticket delivery
              </h3>
              <p className="text-slate-500">No waiting for physical tickets. Get your QR code instantly after purchase and head straight to the venue.</p>
            </div>
            <div className="bg-[#1e1e1e] p-6 rounded-none border border-white/10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />Buyer protection
              </h3>
              <p className="text-slate-500">All tickets are verified and guaranteed. If there's any issue, you get a full refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-slate-500 mb-6">Browse our full catalog of events across Europe.</p>
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

export default EventsThisWeekendPage;
