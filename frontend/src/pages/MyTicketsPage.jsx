import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Ticket, Music, Trophy } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ProfessionalTicket } from "../components/ProfessionalTicket";

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
      <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] pt-20" data-testid="my-tickets-page">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Ticket className="w-7 h-7 text-violet-600" />
          <h1 className="text-3xl font-bold">My Tickets</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20" data-testid="no-tickets">
            <Ticket className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Tickets Yet</h3>
            <p className="text-slate-500 mb-6">Your purchased tickets will appear here</p>
            <Link to="/events">
              <Button className="bg-purple-600 hover:bg-purple-500">Browse Events</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-8 bg-white">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-slate-100" data-testid="tab-upcoming">
                Upcoming ({upcomingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-slate-100" data-testid="tab-past">
                Past ({pastOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-8">
              {upcomingOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No upcoming events</p>
                </div>
              ) : (
                upcomingOrders.map(order => (
                  <ProfessionalTicket key={order.order_id} order={order} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-8">
              {pastOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>No past events</p>
                </div>
              ) : (
                pastOrders.map(order => (
                  <div key={order.order_id} className="opacity-60">
                    <ProfessionalTicket order={order} compact />
                  </div>
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
