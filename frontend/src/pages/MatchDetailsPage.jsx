import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Calendar, MapPin, Ticket, Shield, Star, Users, 
  ChevronRight, AlertCircle, Info, Check
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import StadiumSeatMap from "../components/StadiumSeatMap";

const leagueConfig = {
  champions_league: {
    name: "UEFA Champions League",
    badge: "badge-champions",
    color: "blue"
  },
  premier_league: {
    name: "Premier League",
    badge: "badge-premier",
    color: "purple"
  },
  la_liga: {
    name: "La Liga",
    badge: "badge-laliga",
    color: "red"
  }
};

const categoryConfig = {
  vip: { name: "VIP", color: "bg-amber-500", textColor: "text-amber-400", description: "Premium hospitality with best views" },
  cat1: { name: "Category 1", color: "bg-blue-500", textColor: "text-blue-400", description: "Lower tier, close to the pitch" },
  cat2: { name: "Category 2", color: "bg-green-500", textColor: "text-green-400", description: "Mid-tier, great atmosphere" },
  cat3: { name: "Category 3", color: "bg-slate-400", textColor: "text-slate-400", description: "Upper tier, full stadium view" }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    full: date.toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

const TicketCard = ({ ticket, onSelect, selected }) => {
  const category = categoryConfig[ticket.category];
  
  return (
    <div
      data-testid={`ticket-${ticket.ticket_id}`}
      onClick={() => onSelect(ticket)}
      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
        selected 
          ? 'border-green-500 bg-green-500/10' 
          : 'border-white/10 bg-slate-900/50 hover:border-white/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${category.color}`} />
            <span className="font-bold uppercase">{category.name}</span>
          </div>
          <div className="text-sm text-slate-400 space-y-1">
            <p>Section: {ticket.section}</p>
            <p>Row: {ticket.row} | Seat: {ticket.seat}</p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Users className="w-3 h-3" />
              <span>{ticket.seller_name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black">€{ticket.price.toFixed(0)}</div>
          {ticket.price < ticket.original_price && (
            <div className="text-sm text-slate-500 line-through">€{ticket.original_price}</div>
          )}
          {selected && (
            <div className="mt-2 flex items-center gap-1 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              Selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MatchDetailsPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`${API}/matches/${matchId}`);
        setMatch(response.data);
      } catch (error) {
        console.error("Error fetching match:", error);
        toast.error("Match not found");
        navigate('/matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId, navigate]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSelectedTicket(null);
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket.ticket_id === selectedTicket?.ticket_id ? null : ticket);
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please sign in to purchase tickets");
      login();
      return;
    }

    if (!selectedTicket) {
      toast.error("Please select a ticket");
      return;
    }

    setPurchasing(true);
    try {
      const response = await axios.post(`${API}/checkout/create`, {
        ticket_id: selectedTicket.ticket_id,
        origin_url: window.location.origin
      }, { withCredentials: true });

      // Redirect to Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.detail || "Failed to create checkout");
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) return null;

  const dateInfo = formatDate(match.match_date);
  const league = leagueConfig[match.league];
  const filteredTickets = selectedCategory 
    ? match.tickets.filter(t => t.category === selectedCategory)
    : match.tickets;

  const commission = selectedTicket ? selectedTicket.price * 0.10 : 0;
  const totalAmount = selectedTicket ? selectedTicket.price + commission : 0;

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
          <Badge className={`${league.badge} mb-4 w-fit`}>{league.name}</Badge>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/10 rounded-full p-3 flex items-center justify-center backdrop-blur">
                <img 
                  src={match.home_logo} 
                  alt={match.home_team}
                  className="w-14 h-14 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase">{match.home_team}</h1>
            </div>
            
            <span className="text-4xl font-black text-slate-600">VS</span>
            
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black uppercase">{match.away_team}</h1>
              <div className="w-20 h-20 bg-white/10 rounded-full p-3 flex items-center justify-center backdrop-blur">
                <img 
                  src={match.away_logo} 
                  alt={match.away_team}
                  className="w-14 h-14 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{dateInfo.full} - {dateInfo.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{match.stadium}, {match.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stadium Map & Tickets */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stadium Seat Map */}
            <div className="card-dark p-6">
              <h2 className="text-2xl font-bold uppercase mb-6">Select Your Seats</h2>
              <StadiumSeatMap 
                categories={match.categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
              
              {/* Category Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {Object.entries(categoryConfig).map(([key, cat]) => {
                  const catData = match.categories?.[key];
                  return (
                    <button
                      key={key}
                      data-testid={`category-${key}`}
                      onClick={() => handleCategorySelect(key)}
                      disabled={!catData || catData.count === 0}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedCategory === key 
                          ? 'border-white bg-white/10' 
                          : 'border-white/10 hover:border-white/30'
                      } ${(!catData || catData.count === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${cat.color}`} />
                        <span className="font-bold uppercase text-sm">{cat.name}</span>
                      </div>
                      {catData && catData.count > 0 ? (
                        <div className="text-left">
                          <div className="text-lg font-black">€{catData.lowest_price.toFixed(0)}</div>
                          <div className="text-xs text-slate-400">{catData.count} available</div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">Sold out</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Tickets */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold uppercase">
                  {selectedCategory ? `${categoryConfig[selectedCategory].name} Tickets` : 'All Available Tickets'}
                </h2>
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  {filteredTickets.length} available
                </Badge>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tickets available in this category</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredTickets.map(ticket => (
                    <TicketCard 
                      key={ticket.ticket_id}
                      ticket={ticket}
                      selected={selectedTicket?.ticket_id === ticket.ticket_id}
                      onSelect={handleTicketSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Purchase Summary */}
          <div className="lg:col-span-1">
            <div className="card-dark p-6 sticky top-24">
              <h2 className="text-xl font-bold uppercase mb-6">Order Summary</h2>

              {selectedTicket ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Match</span>
                      <span className="font-bold">{match.home_team} vs {match.away_team}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category</span>
                      <span className={categoryConfig[selectedTicket.category].textColor}>
                        {categoryConfig[selectedTicket.category].name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Section</span>
                      <span>{selectedTicket.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Row / Seat</span>
                      <span>{selectedTicket.row} / {selectedTicket.seat}</span>
                    </div>
                    
                    <hr className="border-white/10" />
                    
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ticket Price</span>
                      <span>€{selectedTicket.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1">
                        Service Fee (10%)
                        <Info className="w-3 h-3" />
                      </span>
                      <span>€{commission.toFixed(2)}</span>
                    </div>
                    
                    <hr className="border-white/10" />
                    
                    <div className="flex justify-between text-xl font-black">
                      <span>Total</span>
                      <span>€{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    data-testid="purchase-btn"
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full btn-primary h-14 text-lg"
                  >
                    {purchasing ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Ticket className="w-5 h-5 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>

                  <div className="mt-6 space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>100% Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Instant QR Code Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Verified Seller</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Ticket className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select a ticket to continue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;
