import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, MapPin, Calendar, Info, ArrowRight, Star, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHead from '../components/SEOHead';
import axios from 'axios';
import { API } from '../App';

const PRICE_DATA = {
  f1: {
    title: 'F1 Ticket Prices 2026',
    subtitle: 'Complete Formula 1 Price Guide',
    description: 'F1 ticket prices for 2026 season. General admission from €89, grandstand from €199, VIP from €899. Compare prices for all Grand Prix races.',
    heroImage: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200',
    categories: [
      { name: 'General Admission', price: '€89 - €199', description: 'Standing areas with big screens and atmosphere', icon: '🎫' },
      { name: 'Grandstand', price: '€199 - €599', description: 'Reserved seating with excellent track views', icon: '🏟️' },
      { name: 'VIP Hospitality', price: '€899 - €2,999', description: 'Premium hospitality, paddock access, driver meet', icon: '👑' },
    ],
    cheapestRaces: [
      { name: 'Chinese GP', city: 'Shanghai', price: '€89' },
      { name: 'Bahrain GP', city: 'Sakhir', price: '€99' },
      { name: 'Hungarian GP', city: 'Budapest', price: '€109' },
    ],
    expensiveRaces: [
      { name: 'Monaco GP', city: 'Monte Carlo', price: '€399+' },
      { name: 'Las Vegas GP', city: 'Las Vegas', price: '€349+' },
      { name: 'Singapore GP', city: 'Marina Bay', price: '€299+' },
    ],
    link: '/f1-tickets'
  },
  motogp: {
    title: 'MotoGP Ticket Prices 2026',
    subtitle: 'Complete MotoGP Price Guide',
    description: 'MotoGP ticket prices for 2026. General admission from €69, grandstand from €149, VIP from €499. All 21 races compared.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    categories: [
      { name: 'General Admission', price: '€69 - €129', description: 'Access to general viewing areas around the circuit', icon: '🎫' },
      { name: 'Grandstand', price: '€149 - €349', description: 'Reserved seating at key corners and straights', icon: '🏟️' },
      { name: 'VIP Village', price: '€499 - €1,499', description: 'Hospitality, paddock tours, rider access', icon: '👑' },
    ],
    cheapestRaces: [
      { name: 'Thai GP', city: 'Buriram', price: '€69' },
      { name: 'Indonesian GP', city: 'Mandalika', price: '€79' },
      { name: 'Malaysian GP', city: 'Sepang', price: '€89' },
    ],
    expensiveRaces: [
      { name: 'Italian GP', city: 'Mugello', price: '€199+' },
      { name: 'Spanish GP', city: 'Jerez', price: '€179+' },
      { name: 'British GP', city: 'Silverstone', price: '€169+' },
    ],
    link: '/motogp-tickets'
  },
  concert: {
    title: 'Concert Ticket Prices 2026',
    subtitle: 'Complete Concert Price Guide',
    description: 'Concert ticket prices for 2026 tours. Standing from €49, seated from €89, VIP from €299. Taylor Swift, Coldplay, Ed Sheeran and more.',
    heroImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200',
    categories: [
      { name: 'Standing/GA', price: '€49 - €149', description: 'General admission floor or standing areas', icon: '🎫' },
      { name: 'Seated', price: '€89 - €249', description: 'Reserved seats in stadium or arena sections', icon: '💺' },
      { name: 'VIP Package', price: '€299 - €999', description: 'Meet & greet, early entry, exclusive merchandise', icon: '👑' },
    ],
    cheapestRaces: [
      { name: 'Club Shows', city: 'Various', price: '€29+' },
      { name: 'Festival Day Pass', city: 'Europe', price: '€79+' },
      { name: 'Arena Upper Tier', city: 'Various', price: '€59+' },
    ],
    expensiveRaces: [
      { name: 'Taylor Swift', city: 'Stadium Tours', price: '€199+' },
      { name: 'Coldplay', city: 'Stadium Tours', price: '€149+' },
      { name: 'Ed Sheeran', city: 'Stadium Tours', price: '€129+' },
    ],
    link: '/events?type=concert'
  },
  football: {
    title: 'Football Ticket Prices 2026',
    subtitle: 'Complete Football Price Guide',
    description: 'Football ticket prices for 2026. League matches from €29, Champions League from €99, Finals from €499. All competitions covered.',
    heroImage: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200',
    categories: [
      { name: 'League Match', price: '€29 - €149', description: 'Regular season domestic league games', icon: '⚽' },
      { name: 'Champions League', price: '€99 - €399', description: 'UCL group stage and knockout rounds', icon: '🏆' },
      { name: 'Cup Finals', price: '€499 - €1,999', description: 'FA Cup, Champions League Final, World Cup', icon: '👑' },
    ],
    cheapestRaces: [
      { name: 'Bundesliga', city: 'Germany', price: '€29+' },
      { name: 'Ligue 1', city: 'France', price: '€39+' },
      { name: 'La Liga', city: 'Spain', price: '€49+' },
    ],
    expensiveRaces: [
      { name: 'UCL Final', city: 'Munich', price: '€999+' },
      { name: 'El Clasico', city: 'Madrid/Barcelona', price: '€299+' },
      { name: 'North London Derby', city: 'London', price: '€199+' },
    ],
    link: '/events?type=match'
  }
};

const PriceGuidePage = ({ eventType = 'f1' }) => {
  const data = PRICE_DATA[eventType] || PRICE_DATA.f1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventType]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "author": { "@type": "Organization", "name": "EuroMatchTickets" },
    "datePublished": new Date().toISOString().split('T')[0]
  };

  return (
    <div className="min-h-screen bg-[#0e0e14]">
      <SEOHead 
        title={`${data.title} - Price Guide 2026`}
        description={data.description}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${data.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-slate-950" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-16 text-center">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 mb-4">
            <DollarSign className="w-4 h-4 mr-2" />Price Guide 2026
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.title}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">{data.subtitle}</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to={data.link}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700">
                Browse Tickets <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 border-y border-white/5 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-600"><Shield className="w-4 h-4" />100% Guarantee</div>
            <div className="flex items-center gap-2 text-emerald-600"><Star className="w-4 h-4" />Best Prices</div>
            <div className="flex items-center gap-2 text-emerald-600"><DollarSign className="w-4 h-4" />0% Buyer Fees</div>
          </div>
        </div>
      </section>

      {/* Price Categories */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Ticket Categories & Prices</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {data.categories.map((cat, idx) => (
              <div 
                key={idx}
                className={`bg-[#1e1e1e] p-6 rounded-none border ${idx === 2 ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-slate-900/50' : 'border-white/10'}`}
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <div className="text-3xl font-bold text-emerald-600 mb-3">{cat.price}</div>
                <p className="text-slate-500">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cheapest vs Most Expensive */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cheapest */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-none bg-emerald-500/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold">Most Affordable</h2>
              </div>
              
              <div className="space-y-4">
                {data.cheapestRaces.map((item, idx) => (
                  <div key={idx} className="bg-[#1e1e1e] p-4 rounded-none border border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{item.city}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-emerald-600">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Expensive */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-none bg-[#e10600]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold">Premium Events</h2>
              </div>
              
              <div className="space-y-4">
                {data.expensiveRaces.map((item, idx) => (
                  <div key={idx} className="bg-[#1e1e1e] p-4 rounded-none border border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{item.city}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-amber-600">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Money Saving Tips */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Money-Saving Tips</h2>
          
          <div className="bg-[#1e1e1e] p-8 rounded-none border border-white/10">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">1.</span>
                <span><strong>Book Early:</strong> Prices typically increase as the event date approaches. Early bird tickets offer the best value.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">2.</span>
                <span><strong>Use Price Alerts:</strong> Set up alerts on EuroMatchTickets to get notified when prices drop for your desired event.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">3.</span>
                <span><strong>Consider Less Popular Events:</strong> Weekday matches or early-season events often have lower prices.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">4.</span>
                <span><strong>Check General Admission:</strong> GA tickets offer great value and atmosphere, especially for motorsport.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">5.</span>
                <span><strong>Buy on EuroMatchTickets:</strong> We charge 0% buyer fees, saving you 15-25% compared to other platforms.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#15151e]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-slate-500 mb-6">Find the best prices on EuroMatchTickets with 0% buyer fees and instant delivery.</p>
          <Link to={data.link}>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700">
              Browse All Tickets <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Other Price Guides */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">More Price Guides</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.keys(PRICE_DATA).filter(type => type !== eventType).map(type => (
              <Link 
                key={type}
                to={`/${type}-ticket-prices-2026`}
                className="bg-[#15151e] hover:bg-white/10 border border-white/10 hover:border-purple-500/50 px-6 py-3 rounded-full transition-colors capitalize"
              >
                {type === 'f1' ? 'F1' : type} Prices
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceGuidePage;
