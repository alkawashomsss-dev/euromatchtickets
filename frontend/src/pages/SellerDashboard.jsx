import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Ticket, Plus, Trash2, Calendar, MapPin, DollarSign, 
  Star, TrendingUp, Package, AlertCircle, CheckCircle,
  Music, Trophy, User, FileText
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";

const SellerDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [showKYC, setShowKYC] = useState(false);

  const [newTicket, setNewTicket] = useState({
    event_id: '',
    category: 'cat1',
    section: '',
    row: '',
    seat: '',
    price: '',
    original_price: ''
  });

  const [kycData, setKycData] = useState({
    full_name: '',
    date_of_birth: '',
    address: '',
    country: '',
    id_type: 'passport',
    id_number: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsRes, eventsRes] = await Promise.all([
        axios.get(`${API}/seller/tickets`, { withCredentials: true }),
        axios.get(`${API}/events`)
      ]);
      setTickets(ticketsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeSeller = async () => {
    try {
      await axios.post(`${API}/auth/become-seller`, {}, { withCredentials: true });
      await refreshUser();
      toast.success("You are now a seller!");
    } catch (error) {
      toast.error("Failed to upgrade account");
    }
  };

  const handleAddTicket = async () => {
    if (!newTicket.event_id || !newTicket.section || !newTicket.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post(`${API}/tickets`, {
        ...newTicket,
        price: parseFloat(newTicket.price),
        original_price: parseFloat(newTicket.original_price || newTicket.price)
      }, { withCredentials: true });
      
      toast.success("Ticket listed successfully!");
      setShowAddTicket(false);
      setNewTicket({
        event_id: '',
        category: 'cat1',
        section: '',
        row: '',
        seat: '',
        price: '',
        original_price: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add ticket");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await axios.delete(`${API}/tickets/${ticketId}`, { withCredentials: true });
      toast.success("Ticket deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete ticket");
    }
  };

  const handleSubmitKYC = async () => {
    try {
      await axios.post(`${API}/auth/kyc`, kycData, { withCredentials: true });
      toast.success("KYC submitted for review");
      setShowKYC(false);
      await refreshUser();
    } catch (error) {
      toast.error("Failed to submit KYC");
    }
  };

  // If user is not a seller, show upgrade prompt
  if (user?.role === 'buyer') {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Become a Seller</h1>
          <p className="text-zinc-400 mb-8">
            Start selling your tickets on FanPass and reach thousands of fans across Europe.
          </p>
          <ul className="text-left max-w-md mx-auto mb-8 space-y-3">
            <li className="flex items-center gap-3 text-zinc-300">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              List tickets for any event
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Set your own prices
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Secure payments via Stripe
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Build your seller reputation
            </li>
          </ul>
          <Button onClick={handleBecomeSeller} className="btn-accent" data-testid="become-seller-btn">
            Become a Seller
          </Button>
        </div>
      </div>
    );
  }

  const availableTickets = tickets.filter(t => t.status === 'available');
  const soldTickets = tickets.filter(t => t.status === 'sold');

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-zinc-400">Manage your ticket listings</p>
          </div>
          <div className="flex items-center gap-4">
            {/* KYC Status */}
            {user?.kyc_status !== 'verified' && (
              <Dialog open={showKYC} onOpenChange={setShowKYC}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-amber-500/50 text-amber-400">
                    <FileText className="w-4 h-4 mr-2" />
                    {user?.kyc_status === 'submitted' ? 'KYC Pending' : 'Complete KYC'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle>Identity Verification (KYC)</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input 
                          value={kycData.full_name}
                          onChange={(e) => setKycData({...kycData, full_name: e.target.value})}
                          className="input-modern"
                        />
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input 
                          type="date"
                          value={kycData.date_of_birth}
                          onChange={(e) => setKycData({...kycData, date_of_birth: e.target.value})}
                          className="input-modern"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input 
                        value={kycData.address}
                        onChange={(e) => setKycData({...kycData, address: e.target.value})}
                        className="input-modern"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Country</Label>
                        <Input 
                          value={kycData.country}
                          onChange={(e) => setKycData({...kycData, country: e.target.value})}
                          className="input-modern"
                        />
                      </div>
                      <div>
                        <Label>ID Type</Label>
                        <Select value={kycData.id_type} onValueChange={(v) => setKycData({...kycData, id_type: v})}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                            <SelectItem value="drivers_license">Driver's License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>ID Number</Label>
                      <Input 
                        value={kycData.id_number}
                        onChange={(e) => setKycData({...kycData, id_number: e.target.value})}
                        className="input-modern"
                      />
                    </div>
                    <Button onClick={handleSubmitKYC} className="w-full btn-accent">
                      Submit for Verification
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Add Ticket */}
            <Dialog open={showAddTicket} onOpenChange={setShowAddTicket}>
              <DialogTrigger asChild>
                <Button className="btn-accent" data-testid="add-ticket-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  List Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
                <DialogHeader>
                  <DialogTitle>List a New Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Event *</Label>
                    <Select 
                      value={newTicket.event_id} 
                      onValueChange={(v) => setNewTicket({...newTicket, event_id: v})}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                        {events.map(event => (
                          <SelectItem key={event.event_id} value={event.event_id}>
                            {event.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select 
                      value={newTicket.category} 
                      onValueChange={(v) => setNewTicket({...newTicket, category: v})}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="floor">Floor</SelectItem>
                        <SelectItem value="cat1">Category 1</SelectItem>
                        <SelectItem value="cat2">Category 2</SelectItem>
                        <SelectItem value="cat3">Category 3</SelectItem>
                        <SelectItem value="standing">Standing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Section *</Label>
                    <Input 
                      value={newTicket.section}
                      onChange={(e) => setNewTicket({...newTicket, section: e.target.value})}
                      placeholder="e.g., A, 101, FLOOR-A"
                      className="input-modern"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Row</Label>
                      <Input 
                        value={newTicket.row}
                        onChange={(e) => setNewTicket({...newTicket, row: e.target.value})}
                        placeholder="e.g., 5"
                        className="input-modern"
                      />
                    </div>
                    <div>
                      <Label>Seat</Label>
                      <Input 
                        value={newTicket.seat}
                        onChange={(e) => setNewTicket({...newTicket, seat: e.target.value})}
                        placeholder="e.g., 12"
                        className="input-modern"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price (€) *</Label>
                      <Input 
                        type="number"
                        value={newTicket.price}
                        onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
                        placeholder="150"
                        className="input-modern"
                      />
                    </div>
                    <div>
                      <Label>Original Price (€)</Label>
                      <Input 
                        type="number"
                        value={newTicket.original_price}
                        onChange={(e) => setNewTicket({...newTicket, original_price: e.target.value})}
                        placeholder="200"
                        className="input-modern"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddTicket} className="w-full btn-accent">
                    List Ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-5 h-5 text-purple-400" />
              <span className="text-zinc-400">Active Listings</span>
            </div>
            <div className="text-3xl font-bold">{availableTickets.length}</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-zinc-400">Sold</span>
            </div>
            <div className="text-3xl font-bold">{soldTickets.length}</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-zinc-400">Rating</span>
            </div>
            <div className="text-3xl font-bold">{user?.rating?.toFixed(1) || '5.0'}</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span className="text-zinc-400">Total Sales</span>
            </div>
            <div className="text-3xl font-bold">{user?.total_sales || 0}</div>
          </div>
        </div>

        {/* Tickets */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6 bg-zinc-900/50">
            <TabsTrigger value="active" className="data-[state=active]:bg-zinc-800">
              Active ({availableTickets.length})
            </TabsTrigger>
            <TabsTrigger value="sold" className="data-[state=active]:bg-zinc-800">
              Sold ({soldTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : availableTickets.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active listings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableTickets.map(ticket => {
                  const isMatch = ticket.event?.event_type === "match";
                  return (
                    <div key={ticket.ticket_id} className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                          {isMatch ? <Trophy className="w-6 h-6 text-emerald-400" /> : <Music className="w-6 h-6 text-purple-400" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{ticket.event?.title || 'Unknown Event'}</h3>
                          <p className="text-sm text-zinc-400">
                            {ticket.category.toUpperCase()} - Section {ticket.section}
                            {ticket.row && ` - Row ${ticket.row}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xl font-bold">€{ticket.price}</div>
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                            Available
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteTicket(ticket.ticket_id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {soldTickets.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p>No sold tickets yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {soldTickets.map(ticket => (
                  <div key={ticket.ticket_id} className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-zinc-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{ticket.event?.title || 'Unknown Event'}</h3>
                        <p className="text-sm text-zinc-500">
                          {ticket.category.toUpperCase()} - Section {ticket.section}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">€{ticket.price}</div>
                      <Badge variant="outline" className="border-zinc-600 text-zinc-400 text-xs">
                        Sold
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
