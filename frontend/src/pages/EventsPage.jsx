import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { 
  Calendar, MapPin, Ticket, Search, X, ChevronRight, 
  Trophy, Music, Filter, Sparkles, Train, Landmark, PartyPopper, Flag, CircleDot
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
    train: { label: "Train", icon: Train, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    attraction: { label: "Attraction", icon: Landmark, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    festival: { label: "Festival", icon: PartyPopper, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
    f1: { label: "Formula 1", icon: Flag, color: "bg-red-500/20 text-red-400 border-red-500/30" },
    tennis: { label: "Tennis", icon: CircleDot, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  };
  return types[type] || types.match;
};

const EventRow = ({ event }) => {
  const dateInfo = formatDate(event.event_date);
  const typeInfo = getEventTypeInfo(event.event_type);
  const TypeIcon = typeInfo.icon;

  return (
    <Link
      to={`/event/${event.event_id}`}
      data-testid={`event-row-${event.event_id}`}
      className="group block bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-white/10 rounded-2xl p-4 md:p-6 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Image */}
        <div className="w-full md:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src={event.event_image || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=200"}
            alt={event.title}
            loading="lazy"
            decoding="async"
            width="96"
            height="96"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${typeInfo.color} text-xs`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeInfo.label}
            </Badge>
            {event.featured && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors truncate">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="text-zinc-500 text-sm">{event.subtitle}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
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
              <div className="text-sm text-zinc-500">Available</div>
              <div className="text-lg font-bold text-emerald-400">{event.available_tickets}</div>
            </div>
          )}
          
          {event.lowest_price && (
            <div className="text-center">
              <div className="text-sm text-zinc-500">From</div>
              <div className="text-2xl font-bold">€{event.lowest_price.toFixed(0)}</div>
            </div>
          )}

          <div className="flex items-center text-zinc-400 group-hover:text-purple-400 transition-colors">
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
    if (filters.type === 'concert') return 'Concert Tickets Europe';
    if (filters.type === 'match') return 'Football Match Tickets Europe';
    return 'All Events - Football & Concert Tickets';
  };

  const getSEODescription = () => {
    if (filters.type === 'concert') return 'Buy verified concert tickets for Taylor Swift, Coldplay, Drake and more. Secure checkout with instant QR delivery across Europe.';
    if (filters.type === 'match') return 'Buy verified football tickets for Champions League, Premier League, La Liga and Bundesliga. 100% secure with buyer protection.';
    return 'Browse all upcoming events across Europe. Football matches, concerts, and more. Verified tickets with instant QR delivery.';
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title={getSEOTitle()}
        description={getSEODescription()}
      />
      
      {/* Header */}
      <div className="bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Events</h1>
          <p className="text-zinc-400 text-lg">
            Find tickets for concerts, matches, and more across Europe
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
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
              className="w-full md:w-48 bg-zinc-900 border-zinc-800 h-12 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2 text-zinc-500" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="match">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  Football
                </div>
              </SelectItem>
              <SelectItem value="concert">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  Concerts
                </div>
              </SelectItem>
              <SelectItem value="train">
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-blue-400" />
                  Trains
                </div>
              </SelectItem>
              <SelectItem value="attraction">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  Attractions
                </div>
              </SelectItem>
              <SelectItem value="festival">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-pink-400" />
                  Festivals
                </div>
              </SelectItem>
              <SelectItem value="f1">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-red-400" />
                  Formula 1
                </div>
              </SelectItem>
              <SelectItem value="tennis">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-green-400" />
                  Tennis
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
              className="w-full md:w-48 bg-zinc-900 border-zinc-800 h-12 rounded-xl"
            >
              <MapPin className="w-4 h-4 mr-2 text-zinc-500" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
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
              className="border-zinc-800 text-zinc-400 hover:text-white h-12 rounded-xl"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => handleFilterChange('type', 'concert')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
              filters.type === 'concert' 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' 
                : 'border-white/10 text-zinc-400 hover:border-white/20'
            }`}
          >
            <Music className="w-4 h-4" />
            Concerts
          </button>
          <button
            onClick={() => handleFilterChange('type', 'match')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
              filters.type === 'match' 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'border-white/10 text-zinc-400 hover:border-white/20'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Football
          </button>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-400">
            Showing <span className="text-white font-semibold">{events.length}</span> events
          </p>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-32 bg-zinc-900/40 rounded-2xl shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Events Found</h3>
            <p className="text-zinc-400 mb-6">Try adjusting your filters or search terms</p>
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
