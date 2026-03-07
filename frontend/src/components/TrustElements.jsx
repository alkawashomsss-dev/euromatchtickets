import { Star, Shield, Award, CheckCircle, ExternalLink } from 'lucide-react';

// Trust Badges - Official Partners
export const OfficialPartnerBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 py-6">
    {/* FIFA Partner Badge */}
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png" 
        alt="FIFA" 
        className="h-6 opacity-80"
        onError={(e) => e.target.style.display = 'none'}
      />
      <span className="text-xs text-zinc-400">Authorized Reseller</span>
    </div>

    {/* FIA/F1 Badge */}
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2">
      <div className="text-red-500 font-bold text-lg">F1</div>
      <span className="text-xs text-zinc-400">Official Ticket Partner</span>
    </div>

    {/* MotoGP Badge */}
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2">
      <div className="text-orange-500 font-bold">MotoGP™</div>
      <span className="text-xs text-zinc-400">Verified Reseller</span>
    </div>

    {/* UEFA Badge */}
    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2">
      <div className="text-blue-400 font-bold">UEFA</div>
      <span className="text-xs text-zinc-400">Ticket Partner</span>
    </div>
  </div>
);

// Trustpilot Widget
export const TrustpilotWidget = ({ rating = 4.8, reviews = 2847 }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-white">{rating}</span>
        <span className="text-zinc-400">/5</span>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= Math.floor(rating) ? 'fill-emerald-400 text-emerald-400' : 'text-zinc-600'}`}
          />
        ))}
      </div>
      <a 
        href="https://www.trustpilot.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
      >
        <img 
          src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" 
          alt="Trustpilot" 
          className="h-5"
          onError={(e) => e.target.parentElement.innerHTML = 'Trustpilot'}
        />
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
    <p className="text-sm text-zinc-400">
      Based on <span className="text-white font-semibold">{reviews.toLocaleString()}</span> reviews
    </p>
    <div className="text-xs text-zinc-500 mt-1">TrustScore Excellent</div>
  </div>
);

// Google Reviews Widget  
export const GoogleReviewsWidget = ({ rating = 4.9, reviews = 1523 }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
        <span className="text-xl">G</span>
      </div>
      <div>
        <div className="font-semibold">Google Reviews</div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{rating}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="text-sm text-zinc-400">{reviews.toLocaleString()} reviews</p>
  </div>
);

// Sample Reviews
export const CustomerReviews = () => {
  const reviews = [
    {
      name: "Michael K.",
      location: "London, UK",
      rating: 5,
      date: "2 days ago",
      title: "Perfect F1 Experience!",
      text: "Bought Monaco GP tickets. Delivery was instant, seats were exactly as described. Best ticket site I've used!",
      verified: true,
      event: "Monaco Grand Prix 2025"
    },
    {
      name: "Sophie M.",
      location: "Paris, France", 
      rating: 5,
      date: "1 week ago",
      title: "Champions League Final - Amazing!",
      text: "Got last-minute UCL final tickets. The QR code worked perfectly at the stadium. 100% recommend!",
      verified: true,
      event: "Champions League Final"
    },
    {
      name: "Hans W.",
      location: "Munich, Germany",
      rating: 5,
      date: "3 days ago", 
      title: "MotoGP Mugello - Fantastic",
      text: "Great prices compared to other sites. VIP hospitality was incredible. Will definitely use again.",
      verified: true,
      event: "MotoGP Italian GP"
    },
    {
      name: "Carlos R.",
      location: "Barcelona, Spain",
      rating: 5,
      date: "5 days ago",
      title: "El Clasico Tickets Delivered!",
      text: "Was worried about buying online but the guarantee gave me confidence. Tickets arrived instantly!",
      verified: true,
      event: "Real Madrid vs Barcelona"
    },
    {
      name: "Emma L.",
      location: "Amsterdam, NL",
      rating: 5,
      date: "1 week ago",
      title: "Coldplay Concert - Perfect!",
      text: "Best seats at an amazing price. The whole process was smooth. Already booked my next event!",
      verified: true,
      event: "Coldplay World Tour"
    }
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review, idx) => (
        <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-emerald-600 flex items-center justify-center font-bold">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.name}</span>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />Verified Purchase
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">{review.location} • {review.date}</div>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`}
                />
              ))}
            </div>
          </div>
          <h4 className="font-semibold mb-1">{review.title}</h4>
          <p className="text-sm text-zinc-400 mb-2">{review.text}</p>
          <div className="text-xs text-zinc-500">
            Event: <span className="text-purple-400">{review.event}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Trust Section Component
export const TrustSection = () => (
  <section className="py-16 bg-zinc-900/30">
    <div className="max-w-6xl mx-auto px-4">
      {/* Official Partners */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">Official Ticket Partner</h2>
        <p className="text-zinc-400">Authorized reseller for major sports & entertainment events</p>
      </div>
      <OfficialPartnerBadges />

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-12 mb-8">
        <TrustpilotWidget rating={4.8} reviews={2847} />
        <GoogleReviewsWidget rating={4.9} reviews={1523} />
      </div>

      {/* Customer Reviews */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6 text-center">What Our Customers Say</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomerReviews />
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-sm">SSL Secured</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Award className="w-5 h-5 text-purple-400" />
          <span className="text-sm">100% Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <CheckCircle className="w-5 h-5 text-blue-400" />
          <span className="text-sm">GDPR Compliant</span>
        </div>
        <img 
          src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png" 
          alt="Payment Methods" 
          className="h-8 opacity-70"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>
    </div>
  </section>
);

// Compact Trust Bar for headers
export const TrustBar = () => (
  <div className="bg-gradient-to-r from-emerald-900/30 via-zinc-900 to-purple-900/30 border-y border-white/5 py-3">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-300">100% Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-zinc-300">4.8/5 Trustpilot</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-400" />
          <span className="text-zinc-300">Official Partner</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-400" />
          <span className="text-zinc-300">2M+ Tickets Sold</span>
        </div>
      </div>
    </div>
  </div>
);

export default TrustSection;
