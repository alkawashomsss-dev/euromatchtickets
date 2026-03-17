import { Star, Shield, Award, CheckCircle, ExternalLink } from 'lucide-react';

export const OfficialPartnerBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 py-6">
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/FIFA_logo_without_slogan.svg/120px-FIFA_logo_without_slogan.svg.png" alt="FIFA" className="h-6 opacity-80" onError={(e) => e.target.style.display = 'none'} />
      <span className="text-xs text-slate-500">Authorized Reseller</span>
    </div>
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
      <div className="text-red-600 font-bold text-lg">F1</div>
      <span className="text-xs text-slate-500">Official Ticket Partner</span>
    </div>
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
      <div className="text-orange-600 font-bold">MotoGP</div>
      <span className="text-xs text-slate-500">Verified Reseller</span>
    </div>
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
      <div className="text-blue-600 font-bold">UEFA</div>
      <span className="text-xs text-slate-500">Ticket Partner</span>
    </div>
  </div>
);

export const TrustpilotWidget = ({ rating = 4.8, reviews = 2847 }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-slate-900">{rating}</span>
        <span className="text-slate-400">/5</span>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-5 h-5 ${star <= Math.floor(rating) ? 'fill-emerald-500 text-emerald-500' : 'text-slate-200'}`} />
        ))}
      </div>
      <a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm">
        Trustpilot <ExternalLink className="w-3 h-3" />
      </a>
    </div>
    <p className="text-sm text-slate-500">Based on <span className="text-slate-900 font-semibold">{reviews.toLocaleString()}</span> reviews</p>
    <div className="text-xs text-slate-400 mt-1">TrustScore Excellent</div>
  </div>
);

export const GoogleReviewsWidget = ({ rating = 4.9, reviews = 1523 }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
        <span className="text-xl font-bold text-slate-700">G</span>
      </div>
      <div>
        <div className="font-semibold text-slate-900">Google Reviews</div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">{rating}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="text-sm text-slate-500">{reviews.toLocaleString()} reviews</p>
  </div>
);

export const CustomerReviews = () => {
  const reviews = [
    { name: "Michael K.", location: "London, UK", rating: 5, date: "2 days ago", title: "Perfect F1 Experience!", text: "Bought Monaco GP tickets. Delivery was instant, seats were exactly as described.", verified: true, event: "Monaco Grand Prix 2025" },
    { name: "Sophie M.", location: "Paris, France", rating: 5, date: "1 week ago", title: "Champions League Final - Amazing!", text: "Got last-minute UCL final tickets. The QR code worked perfectly at the stadium.", verified: true, event: "Champions League Final" },
    { name: "Hans W.", location: "Munich, Germany", rating: 5, date: "3 days ago", title: "MotoGP Mugello - Fantastic", text: "Great prices compared to other sites. VIP hospitality was incredible.", verified: true, event: "MotoGP Italian GP" },
    { name: "Carlos R.", location: "Barcelona, Spain", rating: 5, date: "5 days ago", title: "El Clasico Tickets Delivered!", text: "Was worried about buying online but the guarantee gave me confidence.", verified: true, event: "Real Madrid vs Barcelona" },
    { name: "Emma L.", location: "Amsterdam, NL", rating: 5, date: "1 week ago", title: "Coldplay Concert - Perfect!", text: "Best seats at an amazing price. The whole process was smooth.", verified: true, event: "Coldplay World Tour" }
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {review.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{review.name}</span>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />Verified
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{review.location} &middot; {review.date}</div>
              </div>
            </div>
            <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}</div>
          </div>
          <h4 className="font-semibold text-slate-900 mb-1">{review.title}</h4>
          <p className="text-sm text-slate-500 mb-2">{review.text}</p>
          <div className="text-xs text-slate-400">Event: <span className="text-slate-700 font-medium">{review.event}</span></div>
        </div>
      ))}
    </div>
  );
};

export const TrustSection = () => (
  <section className="py-16 bg-slate-50">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Official Ticket Partner</h2>
        <p className="text-slate-500">Authorized reseller for major sports & entertainment events</p>
      </div>
      <OfficialPartnerBadges />
      <div className="grid md:grid-cols-2 gap-6 mt-12 mb-8">
        <TrustpilotWidget rating={4.8} reviews={2847} />
        <GoogleReviewsWidget rating={4.9} reviews={1523} />
      </div>
      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">What Our Customers Say</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomerReviews />
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-slate-200">
        <span className="flex items-center gap-2 text-slate-500 text-sm"><Shield className="w-5 h-5 text-emerald-600" /> SSL Secured</span>
        <span className="flex items-center gap-2 text-slate-500 text-sm"><Award className="w-5 h-5 text-slate-700" /> 100% Money-Back Guarantee</span>
        <span className="flex items-center gap-2 text-slate-500 text-sm"><CheckCircle className="w-5 h-5 text-blue-600" /> GDPR Compliant</span>
      </div>
    </div>
  </section>
);

export const TrustBar = () => (
  <div className="mt-[68px] sm:mt-[76px] bg-white border-b border-slate-200 py-2">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-center items-center gap-4 sm:gap-6 text-[11px] sm:text-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" /><span className="text-slate-600">100% Guarantee</span></div>
        <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 flex-shrink-0" /><span className="text-slate-600">4.8/5 Trustpilot</span></div>
        <div className="hidden sm:flex items-center gap-1.5"><Award className="w-4 h-4 text-slate-700 flex-shrink-0" /><span className="text-slate-600">Official Partner</span></div>
        <div className="hidden sm:flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" /><span className="text-slate-600">2M+ Tickets Sold</span></div>
      </div>
    </div>
  </div>
);

export default TrustSection;
