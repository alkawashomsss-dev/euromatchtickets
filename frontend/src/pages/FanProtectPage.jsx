import { Shield, CheckCircle, RefreshCw, Clock, CreditCard, Headphones, Award, Lock, Zap, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const FanProtectPage = () => {
  const guarantees = [
    {
      icon: CheckCircle,
      title: "100% Authentic Tickets",
      description: "Every ticket is verified by our expert team before sale. We guarantee authenticity or your money back.",
      color: "emerald"
    },
    {
      icon: RefreshCw,
      title: "Full Refund if Event Cancelled",
      description: "If the event is cancelled and not rescheduled, you'll receive a complete refund within 5 business days.",
      color: "blue"
    },
    {
      icon: Clock,
      title: "On-Time Delivery Guaranteed",
      description: "Your tickets will arrive before the event. If not, we'll find you comparable or better seats, or refund you.",
      color: "purple"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "All transactions are encrypted with 256-bit SSL. We accept Visa, Mastercard, PayPal, and Apple Pay.",
      color: "cyan"
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Our dedicated team is available around the clock to help with any questions or issues.",
      color: "amber"
    },
    {
      icon: Award,
      title: "Market-based pricing",
      description: "Found a lower price elsewhere? We'll match it and give you an extra 5% off.",
      color: "pink"
    }
  ];

  const process = [
    {
      step: 1,
      title: "We Source",
      description: "We partner with verified ticket suppliers, season ticket holders, and official channels worldwide."
    },
    {
      step: 2,
      title: "We Verify",
      description: "Every ticket goes through our multi-point verification process to ensure authenticity."
    },
    {
      step: 3,
      title: "We Deliver",
      description: "You receive your tickets as secure QR codes directly to your email - instant and hassle-free."
    },
    {
      step: 4,
      title: "We Support",
      description: "Our team is with you every step - before, during, and after the event."
    }
  ];

  const stats = [
    { value: "2.4M+", label: "Tickets Delivered" },
    { value: "99.8%", label: "Delivery Success" },
    { value: "850K+", label: "Happy Customers" },
    { value: "", label: "Customer Rating" }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Buyer protection",
    "provider": {
      "@type": "Organization",
      "name": "EuroMatchTickets"
    },
    "description": "100% ticket authenticity guarantee with full refund protection",
    "serviceType": "Ticket Protection",
    "offers": {
      "@type": "Offer",
      "lowPrice": "0",
      "highPrice": "0",
      "priceCurrency": "EUR","description": "Free protection included with every purchase",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "url": "https://euromatchtickets.com/fan-protect",
      "seller": { "@type": "Organization", "name": "EuroMatchTickets", "url": "https://euromatchtickets.com" }
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title="Buyer protection | 100% Ticket Protection"
        description="Our Buyer protection ensures 100% authentic tickets, full refunds for cancelled events, on-time delivery, and 24/7 support. Buy with confidence."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-emerald-900/30 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full mb-8 shadow-lg shadow-emerald-500/30">
              <Shield className="w-12 h-12 text-white" />
            </div>
            
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-600 border-emerald-200 text-sm px-4 py-2">
              <Lock className="w-4 h-4 mr-2" />
              Industry-Leading Protection
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Buyer protection<span className="text-emerald-600">™</span> Guarantee
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
              Every ticket purchase is protected by our comprehensive Buyer protection. 
              Buy with complete confidence - if anything goes wrong, we've got you covered.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/events">
                <Button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-6 text-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Shop Protected
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-6 text-lg border-emerald-500/50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#1e1e1e] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">What's Protected</h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            Our Buyer protection covers you from purchase to event day
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guarantees.map((item, idx) => (
              <div 
                key={idx}
                className={`bg-[#1e1e1e] border border-white/10 rounded-none p-8 hover:border-${item.color}-500/50 transition-all group`}
              >
                <div className={`w-14 h-14 bg-${item.color}-500/20 rounded-none flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 text-${item.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">How We Protect You</h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
            From sourcing to delivery, every step is designed with your protection in mind
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-[#1e1e1e] border border-white/10 rounded-none p-6 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                {idx < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-emerald-500">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-none p-8 md:p-12 text-center">
            <FileCheck className="w-16 h-16 mx-auto mb-6 text-emerald-600" />
            <h2 className="text-2xl font-bold mb-4">Verified & Trusted</h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">
              EuroMatchTickets is a verified member of STAR (Secure Ticket Alliance for Resale) 
              and complies with all EU consumer protection regulations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-[#15151e] rounded-full px-4 py-2">
                <span className="text-2xl">🛡️</span>
                <span className="text-sm">STAR Member</span>
              </div>
              <div className="flex items-center gap-2 bg-[#15151e] rounded-full px-4 py-2">
                <span className="text-2xl">🔒</span>
                <span className="text-sm">PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-[#15151e] rounded-full px-4 py-2">
                <span className="text-2xl">📋</span>
                <span className="text-sm">GDPR Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-[#15151e] rounded-full px-4 py-2">
                <span className="text-2xl">✅</span>
                <span className="text-sm">UK Registered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book with Confidence?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Every ticket is backed by our Buyer protection. Shop worry-free today.
          </p>
          <Link to="/events">
            <Button className="bg-[#1e1e1e] text-emerald-700 hover:bg-zinc-100 px-10 py-6 text-lg font-semibold">
              Browse Protected Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FanProtectPage;
