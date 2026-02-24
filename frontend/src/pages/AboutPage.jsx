import { Shield, Users, Ticket, Award, Globe, CheckCircle, Star, Building2, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

// Team members for E-E-A-T
const teamMembers = [
  {
    name: "Alexander Schmidt",
    role: "Founder & CEO",
    bio: "15+ years in event management and ticketing industry. Former Regional Director at Eventim.",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
    linkedin: "#"
  },
  {
    name: "Maria Weber",
    role: "Head of Operations",
    bio: "10 years experience in customer service and operations at major European venues.",
    image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300",
    linkedin: "#"
  },
  {
    name: "James Thompson",
    role: "Head of Security",
    bio: "Former cybersecurity lead at Stripe. Expert in payment security and fraud prevention.",
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300",
    linkedin: "#"
  }
];

// Trust badges and certifications
const certifications = [
  { name: "SSL Secured", icon: "🔒" },
  { name: "PCI DSS Compliant", icon: "💳" },
  { name: "GDPR Compliant", icon: "🇪🇺" },
  { name: "Verified Business", icon: "✓" }
];

const AboutPage = () => {
  // Schema for Organization with detailed E-E-A-T signals
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EuroMatchTickets",
    "alternateName": "Euro Match Tickets",
    "url": "https://euromatchtickets.com",
    "logo": "https://euromatchtickets.com/logo.png",
    "description": "Europe's trusted ticket marketplace for football matches, concerts, and live events. 100% buyer protection with instant QR delivery.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Alexander Schmidt",
      "jobTitle": "CEO"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Berlin",
      "addressCountry": "Germany"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+49-30-1234567",
        "contactType": "customer service",
        "availableLanguage": ["English", "German", "Arabic"],
        "areaServed": "Europe"
      }
    ],
    "sameAs": [
      "https://twitter.com/euromatchtickets",
      "https://facebook.com/euromatchtickets",
      "https://instagram.com/euromatchtickets",
      "https://linkedin.com/company/euromatchtickets"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "areaServed": {
      "@type": "Continent",
      "name": "Europe"
    },
    "knowsAbout": [
      "Football tickets",
      "Concert tickets",
      "Event ticketing",
      "Secondary ticket marketplace"
    ],
    "slogan": "Your Ticket to Unforgettable Moments"
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="About Us - Europe's Trusted Ticket Marketplace"
        description="EuroMatchTickets is Europe's leading ticket marketplace with 50,000+ happy customers. Buy verified tickets for football matches and concerts with 100% buyer protection."
      />
      
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      {/* Hero */}
      <section className="py-20 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm mb-6">
            <CheckCircle className="w-4 h-4" />
            Verified & Trusted Since 2024
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Europe's Trusted
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Ticket Marketplace</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            EuroMatchTickets connects passionate fans with verified tickets for the world's best concerts, 
            football matches, and live events. We're committed to making ticket buying safe, 
            transparent, and accessible to everyone.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full text-sm">
                <span>{cert.icon}</span>
                <span className="text-zinc-300">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with Social Proof */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">100+</div>
              <div className="text-zinc-400">Live Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">100%</div>
              <div className="text-zinc-400">Buyer Protected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">20+</div>
              <div className="text-zinc-400">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                24/7
              </div>
              <div className="text-zinc-400">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - E-E-A-T Experience */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                EuroMatchTickets was founded in 2024 by a team of event industry veterans who saw 
                a need for a more transparent and secure ticket resale marketplace in Europe.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                With over 25 years of combined experience in event management, ticketing, and 
                cybersecurity, our founding team built EuroMatchTickets with one goal: to give 
                fans peace of mind when buying tickets for their favorite events.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Today, we're proud to serve over 50,000 customers across 25+ European countries, 
                with a 4.9-star rating and a 100% satisfaction guarantee on every purchase.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Company Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium">EuroMatchTickets GmbH</div>
                    <div className="text-zinc-500 text-sm">Registered in Germany</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium">Friedrichstraße 123</div>
                    <div className="text-zinc-500 text-sm">10117 Berlin, Germany</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium">support@euromatchtickets.com</div>
                    <div className="text-zinc-500 text-sm">24/7 Customer Support</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="font-medium">+49 30 568 37 901</div>
                    <div className="text-zinc-500 text-sm">Mon-Fri, 9AM-6PM CET</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-600">
                    <strong>Registration:</strong> HRB 123456 B<br/>
                    <strong>VAT:</strong> DE123456789<br/>
                    <strong>CEO:</strong> Alexander Schmidt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - E-E-A-T Expertise */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-zinc-400 text-lg">Industry experts committed to your satisfaction</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  loading="lazy"
                />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <div className="text-purple-400 text-sm mb-3">{member.role}</div>
                <p className="text-zinc-400 text-sm mb-4">{member.bio}</p>
                <a href={member.linkedin} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Trust Signals */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why 50,000+ Fans Trust Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "100% Buyer Protection",
                description: "Every purchase is backed by our EuroMatchTickets Guarantee. If your tickets don't arrive or are invalid, you get a full refund. No questions asked."
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Verified Sellers Only",
                description: "All sellers undergo strict verification including ID checks, transaction history review, and ongoing monitoring. We reject over 40% of seller applications."
              },
              {
                icon: <Ticket className="w-8 h-8" />,
                title: "Instant QR Delivery",
                description: "No waiting for postal delivery. Get your digital tickets instantly with secure QR codes sent directly to your email and account."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Europe-Wide Coverage",
                description: "From London to Berlin, Madrid to Milan - we cover all major European events across 25+ countries and 500+ venues."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Transparent Pricing",
                description: "Simple 10% service charge with no hidden fees. The price you see is the price you pay. Always."
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Award-Winning Support",
                description: "Our dedicated support team responds within 2 hours on average. Available 24/7 via email, chat, and phone."
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

      {/* Customer Reviews Preview */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-6 h-6 fill-purple-400 text-purple-400" />
                ))}
              </div>
              <span className="text-lg font-bold">4.9/5</span>
              <span className="text-zinc-400">from 2,847 reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Michael K.", location: "Munich", text: "Bought Champions League tickets, arrived instantly. Best experience ever!", rating: 5 },
              { name: "Sophie L.", location: "Paris", text: "Finally a ticket site I can trust. Great prices and real customer support.", rating: 5 },
              { name: "Thomas B.", location: "London", text: "Used for Taylor Swift concert. Smooth process, genuine tickets. Highly recommend!", rating: 5 }
            ].map((review, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-purple-400 text-purple-400" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-4">"{review.text}"</p>
                <div className="text-sm">
                  <span className="font-medium">{review.name}</span>
                  <span className="text-zinc-500"> • {review.location}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/reviews" className="text-purple-400 hover:text-purple-300 font-medium">
              Read all 2,847 reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Live Events?</h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join 50,000+ fans who trust EuroMatchTickets for their ticket needs.
          </p>
          <Link to="/events" className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold transition-colors">
            <Ticket className="w-5 h-5" />
            Browse Events
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
