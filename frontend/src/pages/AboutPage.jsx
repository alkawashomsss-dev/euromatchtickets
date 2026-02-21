import { Shield, Users, Ticket, Award, Globe, CheckCircle } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <Helmet>
        <title>About Us | EuroMatchTickets</title>
        <meta name="description" content="EuroMatchTickets is Europe's trusted ticket marketplace. Buy and sell verified tickets for concerts, football matches, and live events with 100% buyer protection." />
        <meta name="keywords" content="about fanpass, ticket marketplace, secure tickets, buy tickets europe" />
      </Helmet>

      {/* Hero */}
      <section className="py-20 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Europe's Trusted
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Ticket Marketplace</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            EuroMatchTickets connects passionate fans with verified tickets for the world's best concerts, 
            football matches, and live events. We're committed to making ticket buying safe, 
            transparent, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                We believe everyone deserves access to unforgettable live experiences. 
                Whether it's watching your favorite artist perform or cheering for your team 
                in the Champions League final, EuroMatchTickets is here to make it happen.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Founded in 2024, we've grown to become one of Europe's leading secondary ticket 
                marketplaces, trusted by over 50,000 fans across the continent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
                <div className="text-zinc-500">Happy Fans</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">1000+</div>
                <div className="text-zinc-500">Events</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">20+</div>
                <div className="text-zinc-500">Countries</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">4.9</div>
                <div className="text-zinc-500">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EuroMatchTickets?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "100% Buyer Protection",
                description: "Every purchase is backed by our EuroMatchTickets Guarantee. If your tickets don't arrive or are invalid, you get a full refund."
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Verified Sellers",
                description: "All sellers go through our verification process. We check every listing to ensure you're getting legitimate tickets."
              },
              {
                icon: <Ticket className="w-8 h-8" />,
                title: "Instant QR Delivery",
                description: "No waiting for postal delivery. Get your digital tickets instantly with secure QR codes sent directly to your email."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Europe-Wide Coverage",
                description: "From London to Berlin, Madrid to Milan - we cover all major European events and venues."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Fair Marketplace",
                description: "We keep fees transparent with a simple 10% service charge. No hidden costs, no surprises."
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Expert Support",
                description: "Our dedicated support team is available 24/7 to help with any questions or issues."
              }
            ].map((item, index) => (
              <div key={index} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Find Your Event", desc: "Browse thousands of concerts, football matches, and live events across Europe." },
              { step: "2", title: "Choose Your Seats", desc: "Use our interactive venue maps to select the perfect seats for your budget." },
              { step: "3", title: "Secure Checkout", desc: "Pay safely with our encrypted payment system. All major cards accepted." },
              { step: "4", title: "Get Your Tickets", desc: "Receive your digital QR code tickets instantly via email." }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Live Events?</h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of fans who trust EuroMatchTickets for their ticket needs.
          </p>
          <a href="/events" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold transition-colors">
            <Ticket className="w-5 h-5" />
            Browse Events
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
