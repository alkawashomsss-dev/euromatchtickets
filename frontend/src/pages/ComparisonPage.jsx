import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Star, Check, X, ArrowRight, Trophy, DollarSign, Clock, HeadphonesIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import SEOHead from '../components/SEOHead';
import axios from 'axios';
import { API } from '../App';

const COMPETITOR_DATA = {
  'StubHub': {
    logo: 'https://www.stubhub.com/favicon.ico',
    color: 'from-blue-600 to-blue-800',
    founded: '2000',
    headquarters: 'San Francisco, USA',
    fees: '15-25%',
    delivery: '24-48 hours',
    support: 'Email & Phone'
  },
  'Viagogo': {
    logo: 'https://www.viagogo.com/favicon.ico',
    color: 'from-green-600 to-green-800',
    founded: '2006',
    headquarters: 'Geneva, Switzerland',
    fees: '20-30%',
    delivery: 'Varies',
    support: 'Email only'
  },
  'Ticketmaster': {
    logo: 'https://www.ticketmaster.com/favicon.ico',
    color: 'from-blue-500 to-indigo-700',
    founded: '1976',
    headquarters: 'Los Angeles, USA',
    fees: '10-20%',
    delivery: '24 hours',
    support: 'Phone & Chat'
  },
  'SeatGeek': {
    logo: 'https://seatgeek.com/favicon.ico',
    color: 'from-teal-500 to-teal-700',
    founded: '2009',
    headquarters: 'New York, USA',
    fees: '15-20%',
    delivery: 'Instant-48h',
    support: 'Email & Chat'
  }
};

const ComparisonPage = ({ competitor = 'StubHub' }) => {
  const [seoData, setSeoData] = useState(null);
  const competitorInfo = COMPETITOR_DATA[competitor] || COMPETITOR_DATA['StubHub'];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSEOData();
  }, [competitor]);

  const fetchSEOData = async () => {
    try {
      const res = await axios.get(`${API}/seo/compare/${competitor}`);
      setSeoData(res.data);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    }
  };

  const comparisons = [
    { feature: 'Buyer Fees', euro: '0%', competitor: competitorInfo.fees, winner: 'euro' },
    { feature: 'Money-Back Guarantee', euro: '100%', competitor: 'Limited', winner: 'euro' },
    { feature: 'Ticket Delivery', euro: 'Instant QR', competitor: competitorInfo.delivery, winner: 'euro' },
    { feature: 'Customer Support', euro: '24/7 Live Chat', competitor: competitorInfo.support, winner: 'euro' },
    { feature: 'European Events', euro: '50,000+', competitor: 'Large', winner: 'euro' },
    { feature: 'Price Transparency', euro: 'Final price shown', competitor: 'Fees at checkout', winner: 'euro' },
    { feature: 'Mobile Tickets', euro: 'Yes', competitor: 'Yes', winner: 'tie' },
    { feature: 'Seller Verification', euro: 'Required', competitor: 'Varies', winner: 'euro' },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `EuroMatchTickets vs ${competitor} Comparison 2026`,
    "author": { "@type": "Organization", "name": "EuroMatchTickets" },
    "datePublished": new Date().toISOString().split('T')[0]
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title={`EuroMatchTickets vs ${competitor} - Honest Comparison`}
        description={`Compare EuroMatchTickets and ${competitor}. See prices, fees, guarantees. Find out which ticket marketplace is better for you in 2026.`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-zinc-950 to-emerald-900/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtNHYySDB2LTJoMzZ6bTAtNHYySDh2LTJoMjh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 text-center">
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* EuroMatchTickets */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center mb-3 mx-auto">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <span className="text-xl font-bold">EuroMatchTickets</span>
            </div>

            <div className="text-4xl font-bold text-slate-400">VS</div>

            {/* Competitor */}
            <div className="text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${competitorInfo.color} flex items-center justify-center mb-3 mx-auto`}>
                <span className="text-3xl font-bold text-white">{competitor[0]}</span>
              </div>
              <span className="text-xl font-bold">{competitor}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EuroMatchTickets vs {competitor}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Complete 2026 comparison. See which ticket marketplace offers better prices, fees, and buyer protection.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Feature Comparison</h2>
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-slate-50 p-4 font-bold">
              <div>Feature</div>
              <div className="text-center text-violet-600">EuroMatchTickets</div>
              <div className="text-center text-slate-500">{competitor}</div>
            </div>

            {/* Rows */}
            {comparisons.map((row, idx) => (
              <div 
                key={idx}
                className={`grid grid-cols-3 p-4 border-t border-slate-200 ${idx % 2 === 0 ? 'bg-slate-50' : ''}`}
              >
                <div className="font-medium">{row.feature}</div>
                <div className={`text-center flex items-center justify-center gap-2 ${row.winner === 'euro' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {row.winner === 'euro' && <Check className="w-5 h-5" />}
                  {row.euro}
                </div>
                <div className={`text-center flex items-center justify-center gap-2 ${row.winner === 'competitor' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {row.winner === 'competitor' && <Check className="w-5 h-5" />}
                  {row.competitor}
                </div>
              </div>
            ))}
          </div>

          {/* CTA After Table */}
          <div className="mt-8 text-center">
            <Link to="/events">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-5 text-lg rounded-full shadow-lg hover:shadow-xl transition-all" data-testid="comparison-buy-cta">
                Buy Tickets Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-slate-400 text-sm mt-3">0% fees &middot; Instant QR delivery &middot; FanProtect guarantee</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose EuroMatchTickets?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">0% Buyer Fees</h3>
              <p className="text-slate-500 mb-4">Unlike {competitor} which charges {competitorInfo.fees}, we show you the final price upfront with no hidden fees.</p>
              <Link to="/events" className="text-emerald-600 font-bold text-sm hover:underline flex items-center justify-center gap-1">Browse Tickets <ArrowRight className="w-4 h-4" /></Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant QR Delivery</h3>
              <p className="text-slate-500 mb-4">Get your tickets immediately as a QR code. No waiting, no shipping, no stress.</p>
              <Link to="/events" className="text-violet-600 font-bold text-sm hover:underline flex items-center justify-center gap-1">Get Tickets <ArrowRight className="w-4 h-4" /></Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Money-Back</h3>
              <p className="text-slate-500 mb-4">Full refund if the event is cancelled. Your purchase is always protected.</p>
              <Link to="/events" className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-1">Shop Now <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verdict */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-purple-900/30 to-emerald-900/30 p-8 rounded-2xl border border-violet-200">
            <h2 className="text-2xl font-bold mb-4">The Verdict</h2>
            <p className="text-lg text-slate-600 mb-6">
              {seoData?.verdict || `EuroMatchTickets offers better prices, lower fees, and instant delivery compared to ${competitor}. With our 100% guarantee and 24/7 support, you can book with confidence.`}
            </p>
            <Link to="/events">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-5 text-lg rounded-full shadow-lg">
                Buy Tickets Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Other Comparisons */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Compare With Other Platforms</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(COMPETITOR_DATA).filter(c => c !== competitor).map(comp => (
              <Link 
                key={comp}
                to={`/euromatchtickets-vs-${comp.toLowerCase()}`}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-purple-500/50 px-6 py-3 rounded-full transition-colors"
              >
                vs {comp}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComparisonPage;
