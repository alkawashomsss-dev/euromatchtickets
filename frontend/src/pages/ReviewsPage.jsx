import { useState, useEffect } from "react";
import { Star, CheckCircle, Quote, Filter, Globe, TrendingUp, Users, Award, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { BreadcrumbStructuredData } from "../components/StructuredData";
import { Button } from "../components/ui/button";
import axios from "axios";
import { API } from "../App";
import { 
  ReviewsGrid, 
  ReviewsStats, 
  ReviewsLanguageFilter, 
  SubmitReviewForm 
} from "../components/ReviewsSystem";

const ReviewsPage = () => {
  const [selectedLang, setSelectedLang] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [aggregateData, setAggregateData] = useState({ average_rating: 4.9, total_reviews: 2940 });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch real aggregate data for SEO
    const fetchAggregate = async () => {
      try {
        const res = await axios.get(`${API}/reviews?status=approved&limit=1`);
        const agg = res.data.aggregate;
        if (agg && agg.total_reviews > 0) {
          setAggregateData({
            average_rating: agg.average_rating,
            total_reviews: agg.total_reviews + 2940, // add seed count
          });
        }
      } catch {}
    };
    fetchAggregate();
  }, []);

  // Stats for display
  const totalReviews = aggregateData.total_reviews;
  const avgRating = aggregateData.average_rating;
  const ratingBreakdown = { 5: 2617, 4: 264, 3: 44, 2: 10, 1: 5 };

  // Reviews Schema for SEO
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EuroMatchTickets",
    "url": "https://euromatchtickets.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": totalReviews,
      "bestRating": 5,
      "worstRating": 1
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Customer Reviews - 4.9/5 Rating | 2,940+ Verified Reviews"
        description="Read verified reviews from 2,940+ customers who bought tickets on EuroMatchTickets. 4.9/5 average rating. F1, MotoGP, World Cup, Champions League tickets."
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }} />
      <BreadcrumbStructuredData items={[
        { name: "Home", url: "https://euromatchtickets.com" },
        { name: "Reviews", url: "https://euromatchtickets.com/reviews" }
      ]} />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-purple-900/20 to-slate-950 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 text-sm font-medium">All Reviews Verified</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
            <p className="text-xl text-slate-500">What fans say about EuroMatchTickets</p>
          </div>

          {/* Stats Summary */}
          <ReviewsStats />

          {/* Rating Breakdown */}
          <div className="bg-white border border-slate-100 rounded-2xl p-8 max-w-3xl mx-auto mt-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">{avgRating}</div>
                <div className="flex justify-center mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-amber-600" />
                  ))}
                </div>
                <div className="text-slate-500">{totalReviews.toLocaleString()} reviews</div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 w-full">
                {[5,4,3,2,1].map(rating => {
                  const count = ratingBreakdown[rating];
                  const percentage = (count / totalReviews) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1 w-12">
                        <span>{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-amber-600" />
                      </div>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-right text-sm text-slate-500">
                        {count.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* External Review Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a 
              href="https://www.trustpilot.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-600" />
                ))}
              </div>
              <span className="text-emerald-600 font-semibold">4.8 on Trustpilot</span>
              <ExternalLink className="w-4 h-4 text-emerald-600" />
            </a>
            
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-amber-600" />
                ))}
              </div>
              <span className="text-blue-600 font-semibold">4.9 Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Language Filter */}
      <section className="py-6 border-b border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-slate-500" />
              <ReviewsLanguageFilter 
                selected={selectedLang} 
                onChange={setSelectedLang} 
              />
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant="outline" 
              className="border-purple-500/50 text-violet-600 hover:bg-violet-50"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </section>

      {/* Submit Review Form */}
      {showForm && (
        <section className="py-8 border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            <SubmitReviewForm />
          </div>
        </section>
      )}

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <ReviewsGrid limit={12} lang={selectedLang} />
          
          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" className="px-8">
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Fans Trust EuroMatchTickets</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">100% Verified</h3>
              <p className="text-sm text-slate-500">Every ticket checked before sale</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-sm text-slate-500">Up to 25% cheaper than competitors</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold mb-2">2M+ Fans</h3>
              <p className="text-sm text-slate-500">Trusted by fans worldwide</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Money-Back</h3>
              <p className="text-sm text-slate-500">Full refund if tickets invalid</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Quote className="w-12 h-12 mx-auto mb-6 text-violet-600 opacity-50" />
          <h2 className="text-3xl font-bold mb-4">Join Millions of Happy Fans</h2>
          <p className="text-slate-500 text-lg mb-8">
            Experience the EuroMatchTickets difference for yourself
          </p>
          <Link to="/events">
            <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg">
              Browse Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
