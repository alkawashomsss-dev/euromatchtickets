import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { 
  Calendar, MapPin, Ticket, Search, X, ChevronRight, 
  Trophy, Music, Filter, Sparkles, Flag
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import SEOHead from "../components/SEOHead";
import { getEventImagePath } from "../utils/eventImages";
import { BreadcrumbStructuredData } from "../components/StructuredData";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

const getEventTypeInfo = (type) => {
  const types = {
    match: { label: "Football", icon: Trophy, color: "bg-[#15803d] text-white border-transparent" },
    football: { label: "Football", icon: Trophy, color: "bg-[#15803d] text-white border-transparent" },
    concert: { label: "Concert", icon: Music, color: "bg-purple-600 text-white border-transparent" },
    f1: { label: "Formula 1", icon: Flag, color: "bg-[#e10600] text-white border-transparent" },
    motogp: { label: "MotoGP", icon: Flag, color: "bg-orange-600 text-white border-transparent" },
    isle_of_man_tt: { label: "Isle of Man TT", icon: Flag, color: "bg-amber-600 text-white border-transparent" },
    festival: { label: "Festival", icon: Music, color: "bg-pink-600 text-white border-transparent" },
    tennis: { label: "Tennis", icon: Trophy, color: "bg-emerald-600 text-white border-transparent" },
  };
  return types[type] || types.match;
};

const EventRow = ({ event }) => {
  const dateInfo = formatDate(event.event_date);
  const typeInfo = getEventTypeInfo(event.event_type);
  const TypeIcon = typeInfo.icon;
  const ticketsLeft = event.available_tickets || 0;
  const isLimited = ticketsLeft > 0 && ticketsLeft <= 10;
  const isFast = ticketsLeft > 10 && ticketsLeft <= 30;

  return (
    <Link
      to={`/event/${event.slug || event.event_id}`}
      data-testid={`event-row-${event.slug || event.event_id}`}
      className="group block bg-[#1e1e1e] hover:bg-[#252530] border border-white/6 hover:border-[#e10600] p-4 md:p-5 transition-colors duration-150"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Image */}
        <div className="w-full md:w-24 h-24 overflow-hidden flex-shrink-0">
          <img
            src={getEventImagePath(event)}
            alt={event.title}
            loading="lazy"
            decoding="async"
            width="96"
            height="96"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${typeInfo.color} text-[10px] font-black uppercase tracking-wider rounded-none`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeInfo.label}
            </Badge>
            {event.featured && (
              <Badge className="bg-[#facc15] text-black border-transparent text-[10px] font-black uppercase tracking-wider rounded-none">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {isLimited && (
              <Badge className="bg-[#e10600] text-white border-transparent text-[10px] font-black uppercase tracking-wider rounded-none animate-pulse">
                {ticketsLeft} LEFT!
              </Badge>
            )}
            {isFast && !isLimited && (
              <Badge className="bg-[#facc15] text-black border-transparent text-[10px] font-black uppercase tracking-wider rounded-none">
                SELLING FAST
              </Badge>
            )}
          </div>

          <h3 className="text-base md:text-lg font-black text-white group-hover:text-[#e10600] transition-colors truncate uppercase tracking-tight">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="text-slate-500 text-sm">{event.subtitle}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateInfo.month} {dateInfo.date}, {dateInfo.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>

        {/* Price & Tickets */}
        <div className="flex items-center gap-6 md:gap-8">
          {event.available_tickets > 0 && (
            <div className="text-center">
              <div className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Available</div>
              <div className="text-lg font-black text-[#15803d]">{event.available_tickets}</div>
            </div>
          )}

          {event.lowest_price && (
            <div className="text-center">
              <div className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">From</div>
              <div className="text-2xl font-black text-[#e10600]">&euro;{event.lowest_price.toFixed(0)}</div>
            </div>
          )}

          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#e10600]/10 flex items-center justify-center group-hover:bg-[#e10600] transition-colors duration-150">
              <ChevronRight className="w-5 h-5 text-[#e10600] group-hover:text-white transition-colors duration-150" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.type && filters.type !== 'all') params.append('event_type', filters.type);
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (filters.search) params.append('search', filters.search);

        const response = await axios.get(`${API}/events?${params.toString()}`);
        setEvents(response.data);
      } catch (error) { console.error("Error fetching events:", error); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, [filters.type, filters.city, filters.search]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.type && newFilters.type !== 'all') params.set('type', newFilters.type);
    if (newFilters.city && newFilters.city !== 'all') params.set('city', newFilters.city);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  const [searchText, setSearchText] = useState(filters.search);
  const debounceRef = useRef(null);

  const handleSearchChange = (value) => {
    setSearchText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, search: value };
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (newFilters.type && newFilters.type !== 'all') params.set('type', newFilters.type);
      if (newFilters.city && newFilters.city !== 'all') params.set('city', newFilters.city);
      if (value) params.set('search', value);
      setSearchParams(params);
    }, 400);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      handleFilterChange('search', e.target.value);
    }
  };

  const clearFilters = () => {
    setFilters({ type: '', city: '', search: '' });
    setSearchText('');
    setSearchParams({});
  };

  const cities = [...new Set(events.map(e => e.city))].sort();
  const hasFilters = filters.type || filters.city || filters.search;

  const getSEOTitle = () => {
    if (filters.type === 'concert') return 'Concert Tickets Europe 2026 - Verified!';
    if (filters.type === 'match') return 'Football Match Tickets Europe 2026';
    if (filters.type === 'f1') return 'F1 Tickets 2026 - All Grand Prix Races';
    return 'All Events - Football, F1 & Concert Tickets';
  };
  const getSEODescription = () => {
    if (filters.type === 'concert') return 'Buy verified concert tickets for Taylor Swift, Coldplay, The Weeknd and more. Secure checkout with QR ticket delivery. Verified prices in Europe!';
    if (filters.type === 'match') return 'Buy verified football tickets for Champions League, Premier League, La Liga and Bundesliga. Verified prices, QR ticket delivery. Buyer protection!';
    if (filters.type === 'f1') return 'Buy F1 2026 tickets for all Grand Prix races. Monaco, Silverstone, Monza, Singapore and more. From \u20ac59. Market pricing may vary.';
    return 'Browse all upcoming events across Europe. Football, F1, concerts. Verified tickets with QR ticket delivery. Verified prices guaranteed!';
  };
  const getCanonicalUrl = () => {
    if (filters.type === 'concert') return 'https://euromatchtickets.com/events?type=concert';
    if (filters.type === 'match') return 'https://euromatchtickets.com/events?type=match';
    if (filters.type === 'f1') return 'https://euromatchtickets.com/events?type=f1';
    return 'https://euromatchtickets.com/events';
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]" data-testid="events-page">
      <SEOHead title={getSEOTitle()} description={getSEODescription()} canonicalUrl={getCanonicalUrl()} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Events", url: "https://euromatchtickets.com/events" }
      ]} />

      {/* Header */}
      <div className="bg-[#15151e] border-b border-white/6">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
          <span className="text-[10px] font-black text-[#e10600] uppercase tracking-widest mb-2 block">BROWSE TICKETS</span>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">All Events</h1>
          <p className="text-slate-500 text-sm">
            Find tickets for concerts, matches, and more across Europe
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
            <Input
              data-testid="search-input"
              placeholder="Search events, artists, teams, venues..."
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-12 bg-[#1e1e1e] border-white/10 text-white placeholder:text-slate-600 focus:border-[#e10600] h-12 rounded-none"
            />
          </div>

          <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger data-testid="type-filter" className="w-full md:w-48 bg-[#1e1e1e] border-white/10 text-white h-12 rounded-none">
              <Filter className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#15151e] border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Types</SelectItem>
              <SelectItem value="match" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-[#15803d]" />Football</div>
              </SelectItem>
              <SelectItem value="concert" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2"><Music className="w-4 h-4 text-[#e10600]" />Concerts</div>
              </SelectItem>
              <SelectItem value="f1" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-[#e10600]" />Formula 1</div>
              </SelectItem>
              <SelectItem value="motogp" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-orange-500" />MotoGP</div>
              </SelectItem>
              <SelectItem value="isle_of_man_tt" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-amber-500" />Isle of Man TT</div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.city || "all"} onValueChange={(value) => handleFilterChange('city', value)}>
            <SelectTrigger data-testid="city-filter" className="w-full md:w-48 bg-[#1e1e1e] border-white/10 text-white h-12 rounded-none">
              <MapPin className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-[#15151e] border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city} className="text-white hover:bg-white/10">{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              data-testid="clear-filters-btn"
              variant="outline"
              onClick={clearFilters}
              className="border-white/20 text-slate-400 hover:text-white hover:bg-white/10 h-12 rounded-none"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { type: 'match', label: 'Football', icon: Trophy },
            { type: 'concert', label: 'Concerts', icon: Music },
            { type: 'f1', label: 'Formula 1', icon: Flag },
          ].map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => handleFilterChange('type', type)}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-bold uppercase tracking-wider transition-colors duration-150 whitespace-nowrap ${
                filters.type === type
                  ? 'bg-[#e10600] border-[#e10600] text-white'
                  : 'border-white/15 text-slate-500 hover:border-white/30 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500 text-sm">
            Showing <span className="text-white font-bold">{events.length}</span> events
          </p>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-28 bg-[#1e1e1e] border border-white/6 shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl font-black text-white mb-2 uppercase">No Events Found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} className="bg-[#e10600] hover:bg-red-700 text-white rounded-none font-bold uppercase tracking-wider">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => (
              <EventRow key={event.event_id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
