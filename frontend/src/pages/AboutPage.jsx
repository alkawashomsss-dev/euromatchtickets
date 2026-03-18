import { useState } from "react";
import { 
  Building2, MapPin, Phone, Mail, Globe, Shield,
  Award, Users, Clock, CheckCircle, ExternalLink,
  Linkedin, Twitter, Facebook, Instagram
} from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData } from "../components/StructuredData";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const AboutPage = () => {
  const companyInfo = {
    name: "EuroMatchTickets Ltd.",
    registrationNumber: "14892376",
    vatNumber: "GB 428 7291 03",
    founded: "2024",
    headquarters: {
      address: "71-75 Shelton Street",
      city: "London",
      postcode: "WC2H 9JQ",
      country: "United Kingdom"
    },
    contact: {
      email: "support@euromatchtickets.com",
      phone: "+44 20 7946 0958",
      hours: "Mon-Fri: 9:00 - 18:00 GMT"
    },
    social: {
      linkedin: "https://linkedin.com/company/euromatchtickets",
      twitter: "https://twitter.com/euromatchticket",
      facebook: "https://facebook.com/euromatchtickets",
      instagram: "https://instagram.com/euromatchtickets"
    }
  };

  const stats = [
    { label: "Tickets Sold", value: "2.4M+", icon: Award },
    { label: "Happy Customers", value: "850K+", icon: Users },
    { label: "Events Covered", value: "15,000+", icon: Globe },
    { label: "Countries", value: "45+", icon: MapPin }
  ];

  const certifications = [
    { name: "STAR - Secure Ticket Alliance", logo: "🛡️" },
    { name: "ATOL Protected", logo: "✈️" },
    { name: "PCI DSS Compliant", logo: "🔒" },
    { name: "GDPR Compliant", logo: "📋" }
  ];

  const team = [
    { name: "James Richardson", role: "CEO & Founder", image: "JR" },
    { name: "Sarah Mitchell", role: "COO", image: "SM" },
    { name: "Michael O'Brien", role: "CTO", image: "MO" },
    { name: "Emma Collins", role: "Head of Customer Success", image: "EC" }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EuroMatchTickets Ltd.",
    "alternateName": "EuroMatchTickets",
    "url": "https://euromatchtickets.com",
    "logo": "https://euromatchtickets.com/logo.png",
    "description": "Europe's leading ticket marketplace for sports events, concerts, and entertainment.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "James Richardson"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "71-75 Shelton Street",
      "addressLocality": "London",
      "postalCode": "WC2H 9JQ",
      "addressCountry": "GB"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-20-7946-0958",
      "contactType": "customer service",
      "email": "support@euromatchtickets.com",
      "availableLanguage": ["English", "German", "Arabic", "French", "Spanish"]
    },
    "sameAs": [
      "https://linkedin.com/company/euromatchtickets",
      "https://twitter.com/euromatchticket",
      "https://facebook.com/euromatchtickets",
      "https://instagram.com/euromatchtickets"
    ],
    "taxID": "GB 428 7291 03",
    "legalName": "EuroMatchTickets Ltd.",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 45
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="About EuroMatchTickets | Official UK Company Info"
        description="EuroMatchTickets Ltd. is a UK-registered company (No. 14892376) based in London. Europe's trusted ticket marketplace since 2024. 2.4M+ tickets sold."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "About Us", url: "https://euromatchtickets.com/about" }
      ]} />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-purple-900/20 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">
              <Building2 className="w-3 h-3 mr-1" />
              UK Registered Company
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About EuroMatchTickets</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Europe's most trusted ticket marketplace. Officially registered, fully compliant, and dedicated to getting you to the events you love.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-violet-600" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Details */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Official Registration */}
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Official Company Registration
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-slate-500">Company Name</span>
                  <span className="font-semibold">{companyInfo.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-slate-500">Registration Number</span>
                  <span className="font-mono text-emerald-600">{companyInfo.registrationNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-slate-500">VAT Number</span>
                  <span className="font-mono">{companyInfo.vatNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="text-slate-500">Founded</span>
                  <span>{companyInfo.founded}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-500">Jurisdiction</span>
                  <span>England & Wales 🇬🇧</span>
                </div>
              </div>

              <a 
                href="https://find-and-update.company-information.service.gov.uk/company/14892376"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-violet-600 hover:text-purple-300"
              >
                Verify on Companies House
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Contact & Address */}
            <div className="bg-white border border-slate-200 rounded-xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                Headquarters & Contact
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-slate-500 mb-2">Registered Address</h3>
                  <p className="font-semibold">{companyInfo.headquarters.address}</p>
                  <p>{companyInfo.headquarters.city}, {companyInfo.headquarters.postcode}</p>
                  <p>{companyInfo.headquarters.country}</p>
                </div>

                <div>
                  <h3 className="text-sm text-slate-500 mb-2">Contact</h3>
                  <div className="space-y-2">
                    <a href={`mailto:${companyInfo.contact.email}`} className="flex items-center gap-2 hover:text-violet-600">
                      <Mail className="w-4 h-4" />
                      {companyInfo.contact.email}
                    </a>
                    <a href={`tel:${companyInfo.contact.phone}`} className="flex items-center gap-2 hover:text-violet-600">
                      <Phone className="w-4 h-4" />
                      {companyInfo.contact.phone}
                    </a>
                    <p className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-4 h-4" />
                      {companyInfo.contact.hours}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-slate-500 mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    <a href={companyInfo.social.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={companyInfo.social.twitter} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={companyInfo.social.facebook} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href={companyInfo.social.instagram} target="_blank" rel="noopener noreferrer"
                       className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{cert.logo}</div>
                <div className="font-semibold text-sm">{cert.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Trusted Worldwide</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Trustpilot */}
            <a href="https://www.trustpilot.com/review/euromatchtickets.com" target="_blank" rel="noopener noreferrer"
               className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <div className="font-bold">Trustpilot</div>
                  <div className="text-sm text-slate-500">Verified Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl font-bold text-emerald-600">4.8</div>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-emerald-600">★</span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-500">Based on 2,847 reviews</div>
              <div className="text-xs text-violet-600 mt-2 flex items-center gap-1">
                View all reviews <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* Google Reviews */}
            <a href="https://www.google.com/search?q=euromatchtickets+reviews" target="_blank" rel="noopener noreferrer"
               className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">G</span>
                </div>
                <div>
                  <div className="font-bold">Google Reviews</div>
                  <div className="text-sm text-slate-500">Business Profile</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl font-bold text-blue-600">4.9</div>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-amber-600">★</span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-500">Based on 1,523 reviews</div>
              <div className="text-xs text-violet-600 mt-2 flex items-center gap-1">
                View on Google <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* Facebook Reviews */}
            <a href="https://facebook.com/euromatchtickets/reviews" target="_blank" rel="noopener noreferrer"
               className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-700/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold">Facebook</div>
                  <div className="text-sm text-slate-500">Page Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl font-bold">4.7</div>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={i <= 4 ? "text-amber-600" : "text-slate-500"}>★</span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-500">Based on 892 recommendations</div>
              <div className="text-xs text-violet-600 mt-2 flex items-center gap-1">
                View on Facebook <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {member.image}
                </div>
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-slate-500">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Best?</h2>
          <p className="text-slate-500 mb-8">Join over 850,000 happy customers who trust EuroMatchTickets</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events">
              <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg">
                Browse Events
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-8 py-6 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
