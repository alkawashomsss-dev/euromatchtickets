import { useState, useEffect } from "react";
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
    match: { label: "Football", icon: Trophy, color: "tag-match" },
    concert: { label: "Concert", icon: Music, color: "tag-concert" },
    f1: { label: "Formula 1", icon: Flag, color: "bg-red-50 text-red-700 border-red-200" },
    motogp: { label: "MotoGP", icon: Flag, color: "bg-orange-50 text-orange-700 border-orange-200" },
    isle_of_man_tt: { label: "Isle of Man TT", icon: Flag, color: "bg-amber-50 text-amber-700 border-amber-200" },
  };
  return types[type] || types.match;
};

const EventRow = ({ event }) => {
  const dateInfo = formatDate(event.event_date);
  const typeInfo = getEventTypeInfo(event.event_type);
  const TypeIcon = typeInfo.icon;

  return (
    <Link
      to={`/event/${event.slug || event.event_id}`}
      data-testid={`event-row-${event.slug || event.event_id}`}
      className="group block bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Image - Local optimized WebP */}
        <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <picture>
            <source type="image/webp" srcSet={`${getEventImagePath(event)}-sm.webp`} />
            <img 
              src={`${getEventImagePath(event)}.jpg`}
              alt={event.title}
              loading="lazy"
              decoding="async"
              width="96"
              height="96"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </picture>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${typeInfo.color} text-xs`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeInfo.label}
            </Badge>
            {event.featured && (
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="text-slate-400 text-sm">{event.subtitle}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{dateInfo.month} {dateInfo.date}, {dateInfo.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>

        {/* Price & Tickets */}
        <div className="flex items-center gap-6 md:gap-8">
          {event.available_tickets > 0 && (
            <div className="text-center">
              <div className="text-sm text-slate-500">Available</div>
              <div className="text-lg font-bold text-emerald-600">{event.available_tickets}</div>
            </div>
          )}
          
          {event.lowest_price && (
            <div className="text-center">
              <div className="text-sm text-slate-500">From</div>
              <div className="text-2xl font-bold text-slate-900">&euro;{event.lowest_price.toFixed(0)}</div>
            </div>
          )}

          <div className="flex items-center text-slate-400 group-hover:text-slate-700 transition-colors">
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
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

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      handleFilterChange('search', e.target.value);
    }
  };

  const clearFilters = () => {
    setFilters({ type: '', city: '', search: '' });
    setSearchParams({});
  };

  const cities = [...new Set(events.map(e => e.city))].sort();
  const hasFilters = filters.type || filters.city || filters.search;

  // Dynamic SEO based on filters
  const getSEOTitle = () => {
    if (filters.type === 'concert') return 'Concert Tickets Europe 2026 - Verified!';
    if (filters.type === 'match') return 'Football Match Tickets Europe 2026';
    if (filters.type === 'f1') return 'F1 Tickets 2026 - All Grand Prix Races';
    return 'All Events - Football, F1 & Concert Tickets';
  };

  const getSEODescription = () => {
    if (filters.type === 'concert') return 'Buy verified concert tickets for Taylor Swift, Coldplay, The Weeknd and more. Secure checkout with instant QR delivery. Cheapest prices in Europe!';
    if (filters.type === 'match') return 'Buy verified football tickets for Champions League, Premier League, La Liga and Bundesliga. Cheapest prices, instant QR delivery. FanProtect guarantee!';
    if (filters.type === 'f1') return 'Buy F1 2026 tickets for all Grand Prix races. Monaco, Silverstone, Monza, Singapore and more. From €59. Best prices guaranteed!';
    return 'Browse all upcoming events across Europe. Football, F1, concerts. Verified tickets with instant QR delivery. Cheapest prices guaranteed!';
  };

  const getCanonicalUrl = () => {
    if (filters.type === 'concert') return 'https://euromatchtickets.com/events?type=concert';
    if (filters.type === 'match') return 'https://euromatchtickets.com/events?type=match';
    if (filters.type === 'f1') return 'https://euromatchtickets.com/events?type=f1';
    return 'https://euromatchtickets.com/events';
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title={getSEOTitle()}
        description={getSEODescription()}
        canonicalUrl={getCanonicalUrl()}
      />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Events", url: "https://euromatchtickets.com/events" }
      ]} />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">All Events</h1>
          <p className="text-slate-500 text-lg">
            Find tickets for concerts, matches, and more across Europe
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              data-testid="search-input"
              placeholder="Search events, artists, teams, venues..."
              defaultValue={filters.search}
              onKeyDown={handleSearch}
              className="pl-12 input-modern"
            />
          </div>

          {/* Type Filter */}
          <Select 
            value={filters.type || "all"} 
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger 
              data-testid="type-filter"
              className="w-full md:w-48 bg-white border-slate-200 h-12 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="match">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  Football
                </div>
              </SelectItem>
              <SelectItem value="concert">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-violet-600" />
                  Concerts
                </div>
              </SelectItem>
              <SelectItem value="f1">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-600" />
                  Formula 1
                </div>
              </SelectItem>
              <SelectItem value="motogp">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-orange-600" />
                  MotoGP
                </div>
              </SelectItem>
              <SelectItem value="isle_of_man_tt">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-amber-600" />
                  Isle of Man TT
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Select 
            value={filters.city || "all"} 
            onValueChange={(value) => handleFilterChange('city', value)}
          >
            <SelectTrigger 
              data-testid="city-filter"
              className="w-full md:w-48 bg-white border-slate-200 h-12 rounded-xl"
            >
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasFilters && (
            <Button
              data-testid="clear-filters-btn"
              variant="outline"
              onClick={clearFilters}
              className="border-slate-200 text-slate-500 hover:text-slate-900 h-12 rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { type: 'match', label: 'Football', icon: Trophy, color: 'emerald' },
            { type: 'concert', label: 'Concerts', icon: Music, color: 'purple' },
            { type: 'f1', label: 'Formula 1', icon: Flag, color: 'red' },
          ].map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleFilterChange('type', type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                filters.type === type 
                  ? `bg-${color}-50 border-${color}-200 text-${color}-700` 
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
              style={filters.type === type ? {} : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500">
            Showing <span className="text-slate-900 font-semibold">{events.length}</span> events
          </p>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Events Found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
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
