import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Calendar, MapPin, Ticket, Shield, Star, Users, 
  ChevronRight, Info, Check, Music, Trophy, FileText
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import VenueSeatMap from "../components/VenueSeatMap";

const categoryConfig = {
  vip: { name: "VIP", color: "bg-amber-500", textColor: "text-amber-400", description: "Premium experience with best views" },
  floor: { name: "Floor", color: "bg-pink-500", textColor: "text-pink-400", description: "Close to the stage" },
  cat1: { name: "Category 1", color: "bg-blue-500", textColor: "text-blue-400", description: "Lower tier, excellent view" },
  cat2: { name: "Category 2", color: "bg-emerald-500", textColor: "text-emerald-400", description: "Mid-tier, great atmosphere" },
  cat3: { name: "Category 3", color: "bg-slate-400", textColor: "text-slate-400", description: "Upper tier, full venue view" },
  standing: { name: "Standing", color: "bg-slate-400", textColor: "text-slate-400", description: "General admission standing" }
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
  const category = categoryConfig[ticket.category] || categoryConfig.cat1;
  
  return (
    <div
      data-testid={`ticket-${ticket.ticket_id}`}
      onClick={() => onSelect(ticket)}
      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
        selected 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-white/5 bg-zinc-900/50 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${category.color}`} />
            <span className="font-semibold">{category.name}</span>
          </div>
          <div className="text-sm text-zinc-400 space-y-1">
            <p>Section: {ticket.section}</p>
            {ticket.row && <p>Row: {ticket.row} | Seat: {ticket.seat}</p>}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Users className="w-3 h-3" />
              <span>{ticket.seller_name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">€{ticket.price.toFixed(0)}</div>
          {ticket.price < ticket.original_price && (
            <div className="text-sm text-zinc-500 line-through">€{ticket.original_price}</div>
          )}
          {selected && (
            <div className="mt-2 flex items-center gap-1 text-purple-400 text-sm">
              <Check className="w-4 h-4" />
              Selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${API}/events/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Event not found");
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  // SEO title - set document title directly (moved before early returns to comply with hooks rules)
  useEffect(() => {
    if (event?.title) {
      document.title = `${event.title} | FanPass`;
    }
    return () => {
      document.title = 'FanPass - Buy Verified Concert & Football Tickets';
    };
  }, [event?.title]);

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

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.detail || "Failed to create checkout");
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  const dateInfo = formatDate(event.event_date);
  const isMatch = event.event_type === "match";
  const filteredTickets = selectedCategory 
    ? event.tickets.filter(t => t.category === selectedCategory)
    : event.tickets;

  const commission = selectedTicket ? selectedTicket.price * 0.10 : 0;
  const totalAmount = selectedTicket ? selectedTicket.price + commission : 0;

  // SEO title - set document title directly
  useEffect(() => {
    if (event?.title) {
      document.title = `${event.title} | FanPass`;
    }
    return () => {
      document.title = 'FanPass - Buy Verified Concert & Football Tickets';
    };
  }, [event?.title]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[450px] overflow-hidden">
        <img 
          src={event.event_image || (isMatch 
            ? "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
            : "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
          )}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
        
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
          <Badge className={`mb-4 w-fit ${isMatch ? 'tag-match' : 'tag-concert'}`}>
            {isMatch ? <Trophy className="w-3 h-3 mr-1" /> : <Music className="w-3 h-3 mr-1" />}
            {isMatch ? "Football Match" : "Concert"}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{event.title}</h1>
          {event.subtitle && (
            <p className="text-xl text-zinc-300 mb-4">{event.subtitle}</p>
          )}

          {isMatch && event.home_team && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full p-2 backdrop-blur flex items-center justify-center">
                  <img src={event.home_logo} alt="" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
                <span className="text-xl font-bold">{event.home_team}</span>
              </div>
              <span className="text-2xl font-bold text-zinc-600">VS</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{event.away_team}</span>
                <div className="w-12 h-12 bg-white/10 rounded-full p-2 backdrop-blur flex items-center justify-center">
                  <img src={event.away_logo} alt="" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 text-zinc-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{dateInfo.full} - {dateInfo.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Venue Map & Tickets */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Event Description - Important for SEO */}
            {event.description && (
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  About This Event
                </h2>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {event.description}
                </p>
                
                {/* Event Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                  <div>
                    <span className="text-zinc-500 text-sm">Date</span>
                    <p className="font-semibold">{dateInfo.full}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-sm">Time</span>
                    <p className="font-semibold">{dateInfo.time}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-sm">Venue</span>
                    <p className="font-semibold">{event.venue}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-sm">Location</span>
                    <p className="font-semibold">{event.city}, {event.country}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Venue Seat Map */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
              <VenueSeatMap 
                categories={event.categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                eventType={event.event_type}
              />
              
              {/* Category Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                {Object.entries(categoryConfig).map(([key, cat]) => {
                  const catData = event.categories?.[key];
                  if (!catData) return null;
                  
                  return (
                    <button
                      key={key}
                      data-testid={`category-${key}`}
                      onClick={() => handleCategorySelect(key)}
                      disabled={!catData || catData.count === 0}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedCategory === key 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-white/5 bg-zinc-900/50 hover:border-white/20'
                      } ${(!catData || catData.count === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                        <span className="font-semibold text-sm">{cat.name}</span>
                      </div>
                      {catData && catData.count > 0 ? (
                        <div className="text-left">
                          <div className="text-lg font-bold">€{catData.lowest_price.toFixed(0)}</div>
                          <div className="text-xs text-zinc-500">{catData.count} available</div>
                        </div>
                      ) : (
                        <div className="text-xs text-zinc-600">Sold out</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tickets */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory ? `${categoryConfig[selectedCategory]?.name || selectedCategory} Tickets` : 'All Available Tickets'}
                </h2>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                  {filteredTickets.length} available
                </Badge>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
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

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {selectedTicket ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Event</span>
                      <span className="font-semibold text-right max-w-[200px] truncate">{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Category</span>
                      <span className={categoryConfig[selectedTicket.category]?.textColor || 'text-white'}>
                        {categoryConfig[selectedTicket.category]?.name || selectedTicket.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Section</span>
                      <span>{selectedTicket.section}</span>
                    </div>
                    {selectedTicket.row && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Row / Seat</span>
                        <span>{selectedTicket.row} / {selectedTicket.seat}</span>
                      </div>
                    )}
                    
                    <hr className="border-white/5" />
                    
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Ticket Price</span>
                      <span>€{selectedTicket.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 flex items-center gap-1">
                        Service Fee (10%)
                        <Info className="w-3 h-3" />
                      </span>
                      <span className="text-zinc-400">€{commission.toFixed(2)}</span>
                    </div>
                    
                    <hr className="border-white/5" />
                    
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>€{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    data-testid="purchase-btn"
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full btn-accent h-14 text-lg rounded-xl"
                  >
                    {purchasing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Ticket className="w-5 h-5 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>

                  <div className="mt-6 space-y-3 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span>100% Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Instant QR Code Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>Verified Seller</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-zinc-500">
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

export default EventDetailsPage;
