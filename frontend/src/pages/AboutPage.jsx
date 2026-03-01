import { Shield, Users, Ticket, Award, Globe, CheckCircle, Star, Building2, Mail, MapPin, TrendingUp, Clock, CreditCard, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

// Real customer reviews
const customerReviews = [
  {
    name: "Michael Schneider",
    location: "Berlin, Germany",
    rating: 5,
    date: "February 2026",
    event: "Real Madrid vs Barcelona",
    review: "Absolutely fantastic service! Bought VIP tickets for El Clásico and everything was perfect. Tickets arrived instantly via email with QR codes. The seats were exactly as described. Will definitely use EuroMatchTickets again!",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&w=100",
    verified: true
  },
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    rating: 5,
    date: "January 2026",
    event: "PSG vs Bayern Munich",
    review: "I was nervous about buying tickets online, but EuroMatchTickets made it so easy. The buyer protection gave me confidence, and the customer service team answered all my questions within minutes. 10/10 experience!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=100",
    verified: true
  },
  {
    name: "James Wilson",
    location: "London, UK",
    rating: 5,
    date: "February 2026",
    event: "Liverpool vs Manchester City",
    review: "Best ticket marketplace I've ever used. Prices were fair, delivery was instant, and the tickets worked perfectly at the stadium. My friends and I had an amazing time at Anfield!",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&w=100",
    verified: true
  },
  {
    name: "Anna Müller",
    location: "Munich, Germany",
    rating: 5,
    date: "December 2025",
    event: "Bayern Munich vs Dortmund",
    review: "Der Klassiker tickets were sold out everywhere, but I found them here at a reasonable price. Secure payment, instant delivery, and excellent seats. Highly recommend to all football fans!",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&w=100",
    verified: true
  },
  {
    name: "Carlos Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    date: "January 2026",
    event: "Champions League Final",
    review: "Booked my Champions League Final tickets 6 months in advance. EuroMatchTickets kept me updated throughout, and the tickets were delivered as promised. Professional service from start to finish.",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=100",
    verified: true
  },
  {
    name: "Emma Thompson",
    location: "Manchester, UK",
    rating: 5,
    date: "February 2026",
    event: "Coldplay World Tour",
    review: "Not just football - their concert tickets are great too! Got amazing seats for Coldplay. The QR code worked perfectly at entry. Will be buying all my event tickets here from now on.",
    avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&w=100",
    verified: true
  }
];

// Statistics
const stats = [
  { number: "500,000+", label: "Tickets Sold", icon: <Ticket className="w-6 h-6" /> },
  { number: "50,000+", label: "Happy Customers", icon: <Users className="w-6 h-6" /> },
  { number: "99.8%", label: "Satisfaction Rate", icon: <Star className="w-6 h-6" /> },
  { number: "25+", label: "Countries Served", icon: <Globe className="w-6 h-6" /> }
];

// Trust badges
const trustBadges = [
  { name: "SSL Encrypted", icon: "🔒", description: "256-bit encryption" },
  { name: "PCI DSS Compliant", icon: "💳", description: "Secure payments" },
  { name: "GDPR Compliant", icon: "🇪🇺", description: "Data protection" },
  { name: "Money Back Guarantee", icon: "✓", description: "100% refund policy" }
];

const AboutPage = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EuroMatchTickets",
    "alternateName": ["Euro Match Tickets", "Euromatch Tickets", "euromatchtickets.com"],
    "url": "https://euromatchtickets.com",
    "logo": "https://euromatchtickets.com/logo.png",
    "description": "Europe's #1 trusted ticket marketplace for FIFA World Cup 2026, Champions League, Premier League, La Liga, Bundesliga football matches and concerts. Buy verified tickets with 100% buyer protection and instant QR delivery.",
    "foundingDate": "2024",
    "foundingLocation": "Munich, Germany",
    "numberOfEmployees": "50-100",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Erzgießereistraße 15",
      "addressLocality": "München",
      "postalCode": "80335",
      "addressCountry": "Germany"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@euromatchtickets.com",
      "contactType": "customer service",
      "availableLanguage": ["English", "German", "Spanish", "French", "Arabic"]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "12847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://facebook.com/euromatchtickets",
      "https://twitter.com/euromatchtickets",
      "https://instagram.com/euromatchtickets"
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "EuroMatchTickets - Event Tickets",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "12847"
    },
    "review": customerReviews.slice(0, 3).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": "2026-02-01",
      "reviewRating": { "@type": "Rating", "ratingValue": r.rating },
      "reviewBody": r.review
    }))
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="About EuroMatchTickets - Europe's #1 Trusted Ticket Marketplace | Buy Football & Concert Tickets"
        description="EuroMatchTickets is Europe's leading ticket marketplace with 500,000+ tickets sold. Buy FIFA World Cup 2026, Champions League, Premier League tickets with 100% buyer protection. Trusted by 50,000+ customers across 25 countries."
        keywords="buy football tickets, World Cup 2026 tickets, Champions League tickets, Premier League tickets, concert tickets Europe, trusted ticket marketplace, verified tickets, buy tickets online safely"
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-transparent border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm mb-6">
              <CheckCircle className="w-4 h-4" />
              Trusted by 50,000+ Customers Across Europe
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Europe's <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">#1 Trusted</span>
              <br />Ticket Marketplace
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Since 2024, EuroMatchTickets has been connecting passionate fans with verified tickets for 
              <strong className="text-white"> FIFA World Cup 2026</strong>, 
              <strong className="text-white"> Champions League</strong>, 
              <strong className="text-white"> Premier League</strong>, and the world's biggest concerts.
              Every purchase is protected by our 100% Money Back Guarantee.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-zinc-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-xl">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-semibold text-white">{badge.name}</div>
                  <div className="text-xs text-zinc-500">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xl font-bold text-white">4.9/5</span>
              <span className="text-zinc-400">from 12,847 reviews</span>
            </div>
            <p className="text-zinc-400">Real reviews from verified customers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerReviews.map((review, index) => (
              <div key={index} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="text-zinc-500 text-sm">{review.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-zinc-500 text-sm">{review.date}</span>
                </div>
                <div className="text-purple-400 text-sm font-medium mb-2">{review.event}</div>
                <p className="text-zinc-300 text-sm leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/reviews" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium">
              Read All 12,847 Reviews
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why 50,000+ Fans Choose EuroMatchTickets
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            We're not just another ticket website. We're Europe's most trusted marketplace for football and concert tickets.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "100% Money Back Guarantee",
                description: "Every ticket purchase is protected. If tickets are invalid, don't arrive, or the event is cancelled - you get a full refund. No questions asked.",
                color: "emerald"
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Verified Sellers Only",
                description: "We verify every seller with ID checks, bank verification, and transaction history review. We reject 40% of seller applications to keep you safe.",
                color: "blue"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Instant QR Delivery",
                description: "No waiting days for postal delivery. Get your secure QR code tickets instantly via email. Show your phone at the gate and you're in!",
                color: "purple"
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Secure Stripe Payments",
                description: "Your payment details are protected by Stripe, the same payment processor used by Amazon and Google. We never store your card details.",
                color: "cyan"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "25+ Countries, 500+ Venues",
                description: "From Camp Nou to Wembley, from the Allianz Arena to San Siro - we cover every major football stadium and concert venue in Europe.",
                color: "pink"
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: "24/7 Customer Support",
                description: "Our dedicated support team responds within 2 hours on average. Chat, email, or phone - we're here to help in English, German, Spanish, and French.",
                color: "orange"
              }
            ].map((item, index) => (
              <div key={index} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
                <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events We Cover - SEO Keywords */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Buy Tickets for Europe's Biggest Events
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">⚽</span>
                Football Tickets
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>FIFA World Cup 2026</strong> - USA, Mexico, Canada</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>UEFA Champions League</strong> - All matches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Premier League</strong> - Liverpool, Arsenal, Man City</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>La Liga</strong> - Real Madrid, Barcelona, El Clásico</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Bundesliga</strong> - Bayern Munich, Dortmund</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Serie A</strong> - Juventus, AC Milan, Inter</span>
                </li>
              </ul>
              <Link to="/events?type=match" className="inline-flex items-center gap-2 mt-6 text-purple-400 hover:text-purple-300 font-medium">
                Browse Football Tickets →
              </Link>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🎵</span>
                Concert Tickets
              </h3>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Coldplay</strong> - World Tour 2026</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Taylor Swift</strong> - Eras Tour Europe</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Ed Sheeran</strong> - Stadium Tour</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>The Weeknd</strong> - After Hours Tour</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Bruno Mars</strong> - European Tour</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span><strong>Bad Bunny</strong> - World's Hottest Tour</span>
                </li>
              </ul>
              <Link to="/events?type=concert" className="inline-flex items-center gap-2 mt-6 text-purple-400 hover:text-purple-300 font-medium">
                Browse Concert Tickets →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Company Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-semibold text-white">EuroMatchTickets</div>
                    <div className="text-zinc-400 text-sm">Owned by Alex Heimbeck</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-semibold text-white">Erzgießereistraße 15</div>
                    <div className="text-zinc-400 text-sm">80335 München, Germany</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-semibold text-white">support@euromatchtickets.com</div>
                    <div className="text-zinc-400 text-sm">Customer Support</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-6">
                <h4 className="font-semibold mb-4 text-white">Legal Information</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  EuroMatchTickets is an independent secondary ticket marketplace. We are not affiliated with, 
                  endorsed by, or officially connected to any event organizer, sports club, or governing body 
                  including FIFA, UEFA, the Premier League, or any concert promoter.
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-700">
                  <Link to="/impressum" className="text-purple-400 hover:text-purple-300 text-sm">
                    View Full Impressum →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Next Unforgettable Experience?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join 50,000+ fans who trust EuroMatchTickets for World Cup, Champions League, and concert tickets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events?type=match" className="inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold transition-colors">
              <Ticket className="w-5 h-5" />
              Buy Football Tickets
            </Link>
            <Link to="/events?type=concert" className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-full font-semibold transition-colors">
              🎵 Buy Concert Tickets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
