import { useState, useEffect } from "react";
import axios from "axios";
import { API, useAuth } from "../App";
import { 
  Users, Ticket, DollarSign, TrendingUp, AlertTriangle, 
  CheckCircle, XCircle, Music, Trophy, Calendar, Shield,
  BarChart3, Settings, UserCheck, FileWarning
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, disputesRes, ordersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { withCredentials: true }),
        axios.get(`${API}/admin/users`, { withCredentials: true }),
        axios.get(`${API}/admin/disputes`, { withCredentials: true }),
        axios.get(`${API}/admin/orders`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDisputes(disputesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/role`, { role }, { withCredentials: true });
      toast.success("User role updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleUpdateKYC = async (userId, status) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/kyc`, { status }, { withCredentials: true });
      toast.success("KYC status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update KYC status");
    }
  };

  const handleResolveDispute = async (disputeId, status, resolution) => {
    try {
      await axios.put(`${API}/admin/disputes/${disputeId}`, { status, resolution }, { withCredentials: true });
      toast.success("Dispute updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update dispute");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage users, events, and platform settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <div className="text-sm text-zinc-500">Total Users</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
            <UserCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-2xl font-bold">{stats?.verified_sellers || 0}</div>
            <div className="text-sm text-zinc-500">Verified Sellers</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
            <Calendar className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">{stats?.total_events || 0}</div>
            <div className="text-sm text-zinc-500">Events</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
            <Ticket className="w-5 h-5 text-pink-400 mb-2" />
            <div className="text-2xl font-bold">{stats?.sold_tickets || 0}</div>
            <div className="text-sm text-zinc-500">Tickets Sold</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
            <DollarSign className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">€{stats?.total_revenue?.toLocaleString() || 0}</div>
            <div className="text-sm text-zinc-500">Total Revenue</div>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5">
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold">€{stats?.total_commission?.toLocaleString() || 0}</div>
            <div className="text-sm text-zinc-500">Commission (10%)</div>
          </div>
        </div>

        {/* Open Disputes Alert */}
        {stats?.open_disputes > 0 && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-purple-400" />
            <div>
              <div className="font-semibold text-purple-400">{stats.open_disputes} Open Disputes</div>
              <div className="text-sm text-zinc-400">Require your attention</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 bg-zinc-900/50">
            <TabsTrigger value="users" className="data-[state=active]:bg-zinc-800">
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="disputes" className="data-[state=active]:bg-zinc-800">
              Disputes ({disputes.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-zinc-800">
              Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50 border-b border-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">User</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">KYC Status</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Rating</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Sales</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                      <tr key={u.user_id} className="hover:bg-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {u.picture ? (
                              <img src={u.picture} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Users className="w-4 h-4 text-zinc-500" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{u.name}</div>
                              <div className="text-sm text-zinc-500">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Select 
                            value={u.role} 
                            onValueChange={(v) => handleUpdateRole(u.user_id, v)}
                          >
                            <SelectTrigger className="w-28 bg-zinc-900 border-zinc-800 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              <SelectItem value="buyer">Buyer</SelectItem>
                              <SelectItem value="seller">Seller</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4">
                          {u.role === 'seller' || u.role === 'admin' ? (
                            <Select 
                              value={u.kyc_status || 'pending'} 
                              onValueChange={(v) => handleUpdateKYC(u.user_id, v)}
                            >
                              <SelectTrigger className={`w-28 h-8 ${
                                u.kyc_status === 'verified' ? 'border-emerald-500/50 text-emerald-400' :
                                u.kyc_status === 'rejected' ? 'border-red-500/50 text-red-400' :
                                'border-zinc-800'
                              }`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-zinc-600">N/A</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-purple-400">{u.rating?.toFixed(1) || '5.0'}</span>
                        </td>
                        <td className="p-4">{u.total_sales || 0}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="text-zinc-400">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            {disputes.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No disputes to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {disputes.map(dispute => (
                  <div key={dispute.dispute_id} className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge className={
                          dispute.status === 'open' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                          dispute.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                        }>
                          {dispute.status}
                        </Badge>
                        <h3 className="text-lg font-semibold mt-2">{dispute.reason}</h3>
                        <p className="text-zinc-400 text-sm mt-1">{dispute.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-zinc-500">Buyer:</span> {dispute.buyer?.name}
                      </div>
                      <div>
                        <span className="text-zinc-500">Seller:</span> {dispute.seller?.name}
                      </div>
                      <div>
                        <span className="text-zinc-500">Order:</span> {dispute.order_id}
                      </div>
                      <div>
                        <span className="text-zinc-500">Amount:</span> €{dispute.order?.total_amount}
                      </div>
                    </div>
                    {dispute.status === 'open' && (
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleResolveDispute(dispute.dispute_id, 'resolved', 'Refund issued to buyer')}
                          className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Refund Buyer
                        </Button>
                        <Button 
                          onClick={() => handleResolveDispute(dispute.dispute_id, 'closed', 'No action required')}
                          variant="outline"
                          className="border-zinc-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50 border-b border-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Order ID</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Buyer</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Commission</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-400">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.slice(0, 20).map(order => (
                      <tr key={order.order_id} className="hover:bg-white/5">
                        <td className="p-4 font-mono text-sm">{order.order_id.slice(0, 16)}...</td>
                        <td className="p-4">{order.buyer_email}</td>
                        <td className="p-4 font-semibold">€{order.total_amount?.toFixed(2)}</td>
                        <td className="p-4 text-emerald-400">€{order.commission?.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge className={
                            order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            order.status === 'pending' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                            order.status === 'disputed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                          }>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-zinc-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
