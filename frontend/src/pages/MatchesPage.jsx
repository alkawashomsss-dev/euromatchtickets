import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API } from "../App";
import { Calendar, MapPin, Ticket, Filter, Search, X, ChevronRight, Trophy } from "lucide-react";
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

const leagueConfig = {
  champions_league: {
    name: "UEFA Champions League",
    badge: "badge-champions",
    textColor: "text-blue-400"
  },
  premier_league: {
    name: "Premier League",
    badge: "badge-premier",
    textColor: "text-purple-400"
  },
  la_liga: {
    name: "La Liga",
    badge: "badge-laliga",
    textColor: "text-red-400"
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  };
};

const MatchRow = ({ match }) => {
  const dateInfo = formatDate(match.match_date);
  const league = leagueConfig[match.league];

  return (
    <Link
      to={`/match/${match.match_id}`}
      data-testid={`match-row-${match.match_id}`}
      className="group block bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 hover:border-white/20 rounded-xl p-4 md:p-6 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Date Column */}
        <div className="md:w-32 flex md:flex-col items-center md:items-start gap-2 md:gap-0">
          <div className="text-2xl font-black">{dateInfo.date}</div>
          <div className="text-slate-400 text-sm uppercase">{dateInfo.month}</div>
          <div className="text-slate-500 text-xs">{dateInfo.time}</div>
        </div>

        {/* Match Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <Badge className={`${league.badge} text-xs`}>{league.name}</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full p-1.5 flex items-center justify-center">
                <img 
                  src={match.home_logo} 
                  alt={match.home_team}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="font-bold uppercase text-lg">{match.home_team}</span>
            </div>
            
            <span className="text-slate-600 font-bold">VS</span>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full p-1.5 flex items-center justify-center">
                <img 
                  src={match.away_logo} 
                  alt={match.away_team}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="font-bold uppercase text-lg">{match.away_team}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{match.stadium}, {match.city}</span>
            </div>
          </div>
        </div>

        {/* Tickets & Price */}
        <div className="flex items-center gap-6 md:gap-8">
          {match.available_tickets > 0 && (
            <div className="text-center">
              <div className="text-sm text-slate-400">Available</div>
              <div className="text-lg font-bold text-green-400">{match.available_tickets}</div>
            </div>
          )}
          
          {match.lowest_price && (
            <div className="text-center">
              <div className="text-sm text-slate-400">From</div>
              <div className="text-2xl font-black">€{match.lowest_price.toFixed(0)}</div>
            </div>
          )}

          <div className="flex items-center text-slate-400 group-hover:text-white transition-colors">
            <span className="hidden md:block mr-2">View</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const MatchesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    league: searchParams.get('league') || '',
    city: searchParams.get('city') || '',
    search: ''
  });

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.league) params.append('league', filters.league);
        if (filters.city) params.append('city', filters.city);
        
        const response = await axios.get(`${API}/matches?${params.toString()}`);
        let filteredMatches = response.data;
        
        // Client-side search filter
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filteredMatches = filteredMatches.filter(m => 
            m.home_team.toLowerCase().includes(search) ||
            m.away_team.toLowerCase().includes(search) ||
            m.stadium.toLowerCase().includes(search) ||
            m.city.toLowerCase().includes(search)
          );
        }
        
        setMatches(filteredMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [filters.league, filters.city]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.league) params.set('league', newFilters.league);
    if (newFilters.city) params.set('city', newFilters.city);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ league: '', city: '', search: '' });
    setSearchParams({});
  };

  const filteredMatches = filters.search 
    ? matches.filter(m => 
        m.home_team.toLowerCase().includes(filters.search.toLowerCase()) ||
        m.away_team.toLowerCase().includes(filters.search.toLowerCase()) ||
        m.stadium.toLowerCase().includes(filters.search.toLowerCase()) ||
        m.city.toLowerCase().includes(filters.search.toLowerCase())
      )
    : matches;

  const cities = [...new Set(matches.map(m => m.city))];

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            All Matches
          </h1>
          <p className="text-slate-400 text-lg">
            Find tickets for upcoming European football matches
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
              placeholder="Search teams, stadiums, cities..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-12 bg-slate-900 border-slate-800 h-12 text-white"
            />
          </div>

          {/* League Filter */}
          <Select 
            value={filters.league} 
            onValueChange={(value) => handleFilterChange('league', value)}
          >
            <SelectTrigger 
              data-testid="league-filter"
              className="w-full md:w-64 bg-slate-900 border-slate-800 h-12"
            >
              <Trophy className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Leagues" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">All Leagues</SelectItem>
              <SelectItem value="champions_league">Champions League</SelectItem>
              <SelectItem value="premier_league">Premier League</SelectItem>
              <SelectItem value="la_liga">La Liga</SelectItem>
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Select 
            value={filters.city} 
            onValueChange={(value) => handleFilterChange('city', value)}
          >
            <SelectTrigger 
              data-testid="city-filter"
              className="w-full md:w-48 bg-slate-900 border-slate-800 h-12"
            >
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(filters.league || filters.city || filters.search) && (
            <Button
              data-testid="clear-filters-btn"
              variant="outline"
              onClick={clearFilters}
              className="border-slate-800 text-slate-400 hover:text-white h-12"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400">
            Showing <span className="text-white font-bold">{filteredMatches.length}</span> matches
          </p>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-32 bg-slate-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Matches Found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} className="btn-outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map(match => (
              <MatchRow key={match.match_id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
