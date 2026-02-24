import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  DollarSign, TrendingUp, Users, CreditCard, 
  CheckCircle, Clock, XCircle, ArrowRight,
  Wallet, Send, Eye, RefreshCw
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, sellersRes, payoutsRes] = await Promise.all([
        axios.get(`${API}/owner/dashboard`, { withCredentials: true }),
        axios.get(`${API}/owner/sellers`, { withCredentials: true }),
        axios.get(`${API}/owner/payouts`, { withCredentials: true })
      ]);
      setDashboard(dashRes.data);
      setSellers(sellersRes.data);
      setPayouts(payoutsRes.data);
    } catch (error) {
      console.error("Error fetching owner data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayout = async () => {
    if (!selectedSeller || !payoutAmount) return;
    
    try {
      await axios.post(`${API}/owner/payouts`, {
        seller_id: selectedSeller.user_id,
        amount: parseFloat(payoutAmount),
        notes: payoutNotes
      }, { withCredentials: true });
      
      toast.success(`Payout of €${payoutAmount} created for ${selectedSeller.name}`);
      setShowPayoutDialog(false);
      setPayoutAmount("");
      setPayoutNotes("");
      setSelectedSeller(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to create payout");
    }
  };

  const handleCompletePayout = async (payoutId) => {
    try {
      await axios.put(`${API}/owner/payouts/${payoutId}/complete`, {}, { withCredentials: true });
      toast.success("Payout marked as completed");
      fetchData();
    } catch (error) {
      toast.error("Failed to complete payout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage revenue, payouts, and sellers</p>
          </div>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400">Revenue</Badge>
            </div>
            <div className="text-3xl font-bold">€{dashboard?.revenue?.total?.toLocaleString() || 0}</div>
            <p className="text-zinc-500 text-sm mt-1">Total Revenue</p>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-400">10%</Badge>
            </div>
            <div className="text-3xl font-bold">€{dashboard?.revenue?.commission?.toLocaleString() || 0}</div>
            <p className="text-zinc-500 text-sm mt-1">Your Commission</p>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-400">Pending</Badge>
            </div>
            <div className="text-3xl font-bold">€{dashboard?.payouts?.pending_amount?.toLocaleString() || 0}</div>
            <p className="text-zinc-500 text-sm mt-1">Pending Payouts ({dashboard?.payouts?.pending_count || 0})</p>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-400">Paid</Badge>
            </div>
            <div className="text-3xl font-bold">€{dashboard?.payouts?.total_paid?.toLocaleString() || 0}</div>
            <p className="text-zinc-500 text-sm mt-1">Total Paid to Sellers</p>
          </div>
        </div>

        {/* Orders Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboard?.orders?.pending || 0}</div>
              <p className="text-zinc-500 text-sm">Pending Orders</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboard?.orders?.completed || 0}</div>
              <p className="text-zinc-500 text-sm">Completed Orders</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboard?.orders?.cancelled || 0}</div>
              <p className="text-zinc-500 text-sm">Cancelled Orders</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/5 pb-4">
          {["overview", "sellers", "payouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? "bg-purple-500 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Recent Orders</h2>
            </div>
            <div className="divide-y divide-white/5">
              {dashboard?.recent_orders?.length > 0 ? (
                dashboard.recent_orders.map((order) => (
                  <div key={order.order_id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.event_title}</p>
                      <p className="text-sm text-zinc-500">Order: {order.order_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">€{order.total_amount?.toFixed(2)}</p>
                      <Badge className={
                        order.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                        order.status === "pending" ? "bg-cyan-500/20 text-cyan-400" :
                        "bg-red-500/20 text-red-400"
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500">No orders yet</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sellers" && (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Sellers & Balances</h2>
            </div>
            <div className="divide-y divide-white/5">
              {sellers.length > 0 ? (
                sellers.map((seller) => (
                  <div key={seller.user_id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-sm text-zinc-500">{seller.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-zinc-700 text-zinc-300">
                          {seller.orders_count} sales
                        </Badge>
                        <Badge className={
                          seller.kyc_status === "verified" ? "bg-emerald-500/20 text-emerald-400" :
                          seller.kyc_status === "pending" ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-zinc-700 text-zinc-400"
                        }>
                          KYC: {seller.kyc_status || "none"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-500">Pending Balance</p>
                      <p className="text-2xl font-bold text-emerald-400">€{seller.pending_balance?.toFixed(2)}</p>
                      <p className="text-xs text-zinc-500">Total paid: €{seller.total_paid?.toFixed(2)}</p>
                      {seller.pending_balance > 0 && (
                        <Button
                          size="sm"
                          className="mt-2 btn-accent"
                          onClick={() => {
                            setSelectedSeller(seller);
                            setPayoutAmount(seller.pending_balance.toString());
                            setShowPayoutDialog(true);
                          }}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Pay Out
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500">No sellers registered yet</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Payout History</h2>
            </div>
            <div className="divide-y divide-white/5">
              {payouts.length > 0 ? (
                payouts.map((payout) => (
                  <div key={payout.payout_id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{payout.seller_name}</p>
                      <p className="text-sm text-zinc-500">{payout.seller_email}</p>
                      <p className="text-xs text-zinc-600 mt-1">
                        {new Date(payout.created_at).toLocaleDateString()}
                      </p>
                      {payout.notes && (
                        <p className="text-xs text-zinc-500 mt-1">Note: {payout.notes}</p>
                      )}
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-xl font-bold">€{payout.amount?.toFixed(2)}</p>
                        <Badge className={
                          payout.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                          payout.status === "pending" ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-blue-500/20 text-blue-400"
                        }>
                          {payout.status}
                        </Badge>
                      </div>
                      {payout.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleCompletePayout(payout.payout_id)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-500">No payouts yet</div>
              )}
            </div>
          </div>
        )}

        {/* Payout Dialog */}
        <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Create Payout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedSeller && (
                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="font-medium">{selectedSeller.name}</p>
                  <p className="text-sm text-zinc-400">{selectedSeller.email}</p>
                  <p className="text-sm text-emerald-400 mt-2">
                    Pending Balance: €{selectedSeller.pending_balance?.toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Amount (€)</label>
                <Input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <Input
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="Bank transfer reference, etc."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button
                onClick={handleCreatePayout}
                className="w-full btn-accent"
                disabled={!payoutAmount}
              >
                <Send className="w-4 h-4 mr-2" />
                Create Payout Record
              </Button>
              <p className="text-xs text-zinc-500 text-center">
                After creating the record, transfer the amount manually via bank transfer, 
                then mark as "Paid" when complete.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OwnerDashboard;
