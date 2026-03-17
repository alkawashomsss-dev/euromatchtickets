import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Ticket, Mail, Shield, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";

const PurchaseSuccessPage = () => {
  useEffect(() => {
    // Google Ads Conversion Tracking
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
        'value': 1.0,
        'currency': 'EUR'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <SEOHead 
        title="Purchase Complete | EuroMatchTickets"
        description="Thank you for your purchase. Your tickets are on the way."
      />

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Thank You for Your Purchase!
        </h1>
        <p className="text-xl text-slate-500 mb-8">
          Your order has been confirmed and your tickets are on the way.
        </p>

        {/* Order Details Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-600" />
            What happens next?
          </h2>
          <ul className="space-y-3 text-slate-500">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
              <span>Your tickets will be sent to your email within minutes as a QR code.</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
              <span>Your purchase is protected by our FanProtect™ Guarantee.</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/events">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Browse More Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Trust Badge */}
        <p className="text-sm text-slate-400 mt-8">
          🛡️ Protected by FanProtect™ | 📧 Check your email for tickets
        </p>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
