import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Shield, DollarSign, Zap, Users, Upload, ChevronRight, Star, TrendingUp, Clock, CheckCircle, ArrowRight, Ticket, CreditCard, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import axios from "axios";
import { API } from "../App";

const CATEGORIES = [
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "vip", label: "VIP" },
  { value: "hospitality", label: "Hospitality" },
  { value: "general", label: "General Admission" },
  { value: "grandstand", label: "Grandstand" },
  { value: "floor", label: "Floor / Standing" },
  { value: "box", label: "Executive Box" },
];

const EVENT_TYPES = [
  { value: "football", label: "Football" },
  { value: "f1", label: "Formula 1" },
  { value: "concert", label: "Concert" },
  { value: "motogp", label: "MotoGP" },
  { value: "worldcup", label: "World Cup" },
  { value: "other", label: "Other" },
];

function EarningsCalc({ price, qty }) {
  const gross = price * qty;
  const fee = Math.round(gross * 0.08 * 100) / 100;
  const net = Math.round((gross - fee) * 100) / 100;
  if (!price || !qty) return null;
  return (
    <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-5 mt-4" data-testid="earnings-calculator">
      <h4 className="text-emerald-600 font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" /> Your Estimated Earnings
      </h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-slate-500 text-xs">Gross Revenue</div>
          <div className="text-white font-bold text-lg">{"\u20ac"}{gross.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-500 text-xs">Platform Fee (8%)</div>
          <div className="text-orange-600 font-bold text-lg">-{"\u20ac"}{fee.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-slate-500 text-xs">You Receive</div>
          <div className="text-emerald-600 font-bold text-xl">{"\u20ac"}{net.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function SellerStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {[
        { icon: Users, value: "12,000+", label: "Active Sellers", color: "text-blue-600" },
        { icon: Ticket, value: "850K+", label: "Tickets Sold", color: "text-emerald-600" },
        { icon: Globe, value: "45+", label: "Countries", color: "text-violet-600" },
        { icon: CreditCard, value: "48h", label: "Payout Speed", color: "text-amber-600" },
      ].map((s, i) => (
        <div key={i} className="bg-white/90 border border-slate-200 rounded-xl p-4 text-center">
          <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
          <div className="text-white font-bold text-xl">{s.value}</div>
          <div className="text-slate-500 text-xs">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function SellTicketsPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    event_name: "", event_date: "", event_type: "concert",
    venue: "", city: "", country: "",
    category: "standard", section: "", num_tickets: 1,
    price_per_ticket: "", original_price: "", description: "",
  });
  const [file, setFile] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("ticket_file", file);
      const token = localStorage.getItem("session_token");
      const res = await axios.post(`${API}/seller/list-tickets`, fd, {
        headers: { "Content-Type": "multipart/form-data", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        withCredentials: true,
      });
      setSuccess(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // NOT LOGGED IN - Show landing
  if (!user) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="sell-tickets-page">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-950" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
            <Badge className="bg-emerald-600/20 text-emerald-600 border-emerald-700/50 mb-6">
              Trusted by 12,000+ sellers worldwide
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" data-testid="sell-hero-title">
              Sell Your Tickets.<br />
              <span className="text-emerald-600">Get Paid Fast.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mb-8">
              Turn your unused tickets into cash. List in under 2 minutes. 
              Reach millions of verified buyers. Get paid within 48 hours of the event.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={login} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-lg rounded-xl" data-testid="sell-signin-btn">
                Start Selling Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-600 px-8 py-6 text-lg rounded-xl" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                How It Works
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <SellerStats />

          {/* How it works */}
          <div id="how-it-works" className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-10">How Selling Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Upload, title: "1. List Your Tickets", desc: "Upload your tickets in under 2 minutes. Add event details, set your price, and attach the PDF or QR code." },
                { icon: Users, title: "2. We Find Buyers", desc: "Your tickets are shown to millions of verified buyers actively searching for events. Our SEO reaches 1,700+ pages." },
                { icon: DollarSign, title: "3. Get Paid", desc: "When your tickets sell, you receive payment within 48 hours via bank transfer. Simple, fast, secure." },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 text-center hover:border-emerald-700/50 transition-all">
                  <div className="w-14 h-14 rounded-full bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Why Sellers Choose EuroMatchTickets</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Seller Protection", desc: "Your tickets and earnings are fully protected. We handle disputes and guarantee payment." },
                { icon: Zap, title: "Instant Listing", desc: "List tickets in under 2 minutes. No complicated forms. Just upload and sell." },
                { icon: CreditCard, title: "Fast Payouts", desc: "Get paid within 48 hours of the event. Direct bank transfer to your account." },
                { icon: Star, title: "Fair Fees", desc: "Only 8% platform fee. Lower than StubHub (15%) and Viagogo (20%). You keep more." },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <t.icon className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">{t.title}</h3>
                  <p className="text-slate-400 text-sm">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee comparison */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Compare Seller Fees</h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl mx-auto border border-slate-200 rounded-xl overflow-hidden" data-testid="fee-comparison-table">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-500 font-medium">Platform</th>
                    <th className="px-6 py-4 text-center text-slate-500 font-medium">Seller Fee</th>
                    <th className="px-6 py-4 text-center text-slate-500 font-medium">Payout Speed</th>
                    <th className="px-6 py-4 text-center text-slate-500 font-medium">Seller Protection</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200 bg-emerald-900/10">
                    <td className="px-6 py-4 text-emerald-600 font-bold">EuroMatchTickets</td>
                    <td className="px-6 py-4 text-center text-emerald-600 font-bold">8%</td>
                    <td className="px-6 py-4 text-center text-white">48 hours</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-6 py-4 text-slate-500">StubHub</td>
                    <td className="px-6 py-4 text-center text-red-600">15%</td>
                    <td className="px-6 py-4 text-center text-slate-400">5-8 days</td>
                    <td className="px-6 py-4 text-center text-slate-500">Limited</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-6 py-4 text-slate-500">Viagogo</td>
                    <td className="px-6 py-4 text-center text-red-600">20%</td>
                    <td className="px-6 py-4 text-center text-slate-400">7-10 days</td>
                    <td className="px-6 py-4 text-center text-slate-500">Minimal</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-6 py-4 text-slate-500">Ticketmaster Resale</td>
                    <td className="px-6 py-4 text-center text-red-600">10-15%</td>
                    <td className="px-6 py-4 text-center text-slate-400">3-5 days</td>
                    <td className="px-6 py-4 text-center text-slate-500">Good</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Sell?</h2>
            <p className="text-slate-500 mb-6">Sign in with Google and list your first tickets in under 2 minutes.</p>
            <Button onClick={login} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-6 text-lg rounded-xl" data-testid="sell-cta-signin">
              Sign In & Start Selling <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE
  if (success) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center px-4" data-testid="sell-success">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Tickets Listed Successfully!</h2>
          <p className="text-slate-500 mb-6">{success.message}</p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Listing ID</span><span className="text-white font-mono text-sm">{success.listing_id}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tickets Created</span><span className="text-white">{success.tickets_created}</span></div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => { setSuccess(null); setStep(1); setForm(p => ({...p, event_name:"", description:""})); }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
              List More Tickets
            </Button>
            <Button variant="outline" className="flex-1 border-slate-200 text-slate-600" onClick={() => navigate("/seller")}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // LISTING FORM (LOGGED IN)
  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]" data-testid="sell-tickets-form">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2" data-testid="sell-form-title">List Your Tickets</h1>
          <p className="text-slate-500">Fill in the details below. It takes less than 2 minutes.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10" data-testid="sell-form-progress">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <ChevronRight className={`w-5 h-5 ${step > s ? "text-emerald-500" : "text-slate-400"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          {/* STEP 1: Event Details */}
          {step === 1 && (
            <div className="space-y-5" data-testid="sell-step-1">
              <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>
              <div>
                <label className="text-slate-600 text-sm mb-1.5 block">Event Name *</label>
                <Input value={form.event_name} onChange={e => set("event_name", e.target.value)} placeholder="e.g. Taylor Swift Eras Tour - London" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-event-name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Event Date *</label>
                  <Input type="datetime-local" value={form.event_date} onChange={e => set("event_date", e.target.value)} className="bg-slate-100 border-slate-200 text-white" data-testid="sell-event-date" />
                </div>
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Event Type</label>
                  <select value={form.event_type} onChange={e => set("event_type", e.target.value)} className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-md text-white" data-testid="sell-event-type">
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-600 text-sm mb-1.5 block">Venue *</label>
                <Input value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="e.g. Wembley Stadium" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-venue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">City *</label>
                  <Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. London" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-city" />
                </div>
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Country</label>
                  <Input value={form.country} onChange={e => set("country", e.target.value)} placeholder="e.g. UK" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-country" />
                </div>
              </div>
              <Button onClick={() => setStep(2)} disabled={!form.event_name || !form.event_date || !form.venue || !form.city} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-xl mt-4" data-testid="sell-next-step-1">
                Continue to Ticket Details <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP 2: Ticket Details */}
          {step === 2 && (
            <div className="space-y-5" data-testid="sell-step-2">
              <h2 className="text-xl font-bold text-white mb-4">Ticket Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Category</label>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-md text-white" data-testid="sell-category">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Section / Block</label>
                  <Input value={form.section} onChange={e => set("section", e.target.value)} placeholder="e.g. Block A, Row 12" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-section" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Number of Tickets *</label>
                  <Input type="number" min={1} max={50} value={form.num_tickets} onChange={e => set("num_tickets", parseInt(e.target.value) || 1)} className="bg-slate-100 border-slate-200 text-white" data-testid="sell-num-tickets" />
                </div>
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Your Price ({"\u20ac"}) *</label>
                  <Input type="number" min={1} step={0.01} value={form.price_per_ticket} onChange={e => set("price_per_ticket", e.target.value)} placeholder="149.00" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-price" />
                </div>
                <div>
                  <label className="text-slate-600 text-sm mb-1.5 block">Face Value ({"\u20ac"})</label>
                  <Input type="number" min={0} step={0.01} value={form.original_price} onChange={e => set("original_price", e.target.value)} placeholder="200.00" className="bg-slate-100 border-slate-200 text-white" data-testid="sell-face-value" />
                </div>
              </div>
              <EarningsCalc price={parseFloat(form.price_per_ticket) || 0} qty={form.num_tickets} />
              <div>
                <label className="text-slate-600 text-sm mb-1.5 block">Description (optional)</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Any additional details about the tickets..." rows={3} className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-white resize-none" data-testid="sell-description" />
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="border-slate-200 text-slate-600">Back</Button>
                <Button onClick={() => setStep(3)} disabled={!form.price_per_ticket} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-xl" data-testid="sell-next-step-2">
                  Continue to Upload <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload & Submit */}
          {step === 3 && (
            <div className="space-y-5" data-testid="sell-step-3">
              <h2 className="text-xl font-bold text-white mb-4">Upload Tickets & Confirm</h2>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-600/50 transition-colors cursor-pointer" onClick={() => document.getElementById("ticket-file-input")?.click()} data-testid="sell-upload-area">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                {file ? (
                  <div>
                    <p className="text-emerald-600 font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-600 font-medium">Upload Ticket PDF or QR Code</p>
                    <p className="text-slate-400 text-sm mt-1">PDF, PNG, JPG accepted. Max 10MB.</p>
                  </div>
                )}
                <input id="ticket-file-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={e => setFile(e.target.files[0])} className="hidden" />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-6 space-y-3" data-testid="sell-summary">
                <h3 className="text-white font-semibold mb-3">Listing Summary</h3>
                <div className="flex justify-between"><span className="text-slate-500">Event</span><span className="text-white">{form.event_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Venue</span><span className="text-white">{form.venue}, {form.city}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="text-white capitalize">{form.category}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tickets</span><span className="text-white">{form.num_tickets}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Price per ticket</span><span className="text-emerald-600 font-bold">{"\u20ac"}{form.price_per_ticket}</span></div>
                {file && <div className="flex justify-between"><span className="text-slate-500">File</span><span className="text-white">{file.name}</span></div>}
              </div>

              {error && <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-red-600 text-sm">{error}</div>}

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="border-slate-200 text-slate-600">Back</Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-xl" data-testid="sell-submit-btn">
                  {loading ? (
                    <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Listing...</div>
                  ) : (
                    <>List {form.num_tickets} Ticket{form.num_tickets > 1 ? "s" : ""} for Sale</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Trust footer */}
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
          <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> Seller Protection</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> 48h Payouts</div>
          <div className="flex items-center gap-1"><Star className="w-4 h-4" /> 4.8/5 Rating</div>
        </div>
      </div>
    </div>
  );
}
