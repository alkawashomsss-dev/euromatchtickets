import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Ticket, Calendar, MapPin, QrCode, Download, Music, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { QRCodeSVG } from "qrcode.react";

const TicketCard = ({ order }) => {
  const [showQR, setShowQR] = useState(false);
  const event = order.event;
  const ticket = order.ticket;
  const isMatch = event?.event_type === "match";

  const eventDate = new Date(event?.event_date);
  const isPast = eventDate < new Date();

  return (
    <div className={`bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* Event Image */}
        <div className="md:w-48 h-40 md:h-auto relative overflow-hidden">
          <img 
            src={event?.event_image || (isMatch 
              ? "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
              : "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
            )}
            alt={event?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/80 md:bg-gradient-to-t md:from-zinc-950/80 md:to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className={isMatch ? "tag-match mb-2" : "tag-concert mb-2"}>
                {isMatch ? <Trophy className="w-3 h-3 mr-1" /> : <Music className="w-3 h-3 mr-1" />}
                {isMatch ? "Match" : "Concert"}
              </Badge>
              <h3 className="text-xl font-bold">{event?.title}</h3>
              {event?.subtitle && (
                <p className="text-zinc-400 text-sm">{event.subtitle}</p>
              )}
            </div>
            <Badge 
              variant="outline" 
              className={order.status === 'completed' ? 'border-emerald-500/50 text-emerald-400' : 'border-purple-500/50 text-purple-400'}
            >
              {order.status === 'completed' ? 'Confirmed' : order.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <span className="text-zinc-500">Date</span>
              <p className="font-medium">{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <span className="text-zinc-500">Venue</span>
              <p className="font-medium">{event?.venue}</p>
            </div>
            <div>
              <span className="text-zinc-500">Section</span>
              <p className="font-medium capitalize">{ticket?.category} - {ticket?.section}</p>
            </div>
            {ticket?.row && (
              <div>
                <span className="text-zinc-500">Row / Seat</span>
                <p className="font-medium">{ticket.row} / {ticket.seat}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setShowQR(!showQR)}
              variant="outline"
              className="border-zinc-800"
              data-testid={`show-qr-${order.order_id}`}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? 'Hide' : 'Show'} QR Code
            </Button>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {showQR && (
        <div className="border-t border-white/5 p-6 bg-white text-center">
          {order.qr_code ? (
            <img 
              src={`data:image/png;base64,${order.qr_code}`}
              alt="Ticket QR Code"
              className="w-40 h-40 mx-auto"
            />
          ) : (
            <QRCodeSVG 
              value={`FANPASS-${order.order_id}-${order.ticket_id}`}
              size={160}
              className="mx-auto"
            />
          )}
          <p className="text-zinc-600 text-sm mt-3">Order: {order.order_id}</p>
        </div>
      )}
    </div>
  );
};

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API}/orders`, { withCredentials: true });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const upcomingOrders = orders.filter(o => {
    const eventDate = new Date(o.event?.event_date);
    return eventDate >= new Date() && o.status === 'completed';
  });

  const pastOrders = orders.filter(o => {
    const eventDate = new Date(o.event?.event_date);
    return eventDate < new Date() || o.status !== 'completed';
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Tickets Yet</h3>
            <p className="text-zinc-400 mb-6">Your purchased tickets will appear here</p>
            <Link to="/events">
              <Button className="btn-accent">Browse Events</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-8 bg-zinc-900/50">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-zinc-800">
                Upcoming ({upcomingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-zinc-800">
                Past ({pastOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingOrders.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <p>No upcoming events</p>
                </div>
              ) : (
                upcomingOrders.map(order => (
                  <TicketCard key={order.order_id} order={order} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastOrders.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <p>No past events</p>
                </div>
              ) : (
                pastOrders.map(order => (
                  <TicketCard key={order.order_id} order={order} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
