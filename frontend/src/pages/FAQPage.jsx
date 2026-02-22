import { useState } from "react";
import { ChevronDown, Search, HelpCircle, Ticket, CreditCard, Shield, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

const faqCategories = [
  { id: "buying", name: "Buying Tickets", icon: <Ticket className="w-5 h-5" /> },
  { id: "payment", name: "Payment & Pricing", icon: <CreditCard className="w-5 h-5" /> },
  { id: "delivery", name: "Ticket Delivery", icon: <Mail className="w-5 h-5" /> },
  { id: "security", name: "Security & Trust", icon: <Shield className="w-5 h-5" /> },
];

const faqData = {
  buying: [
    {
      question: "How do I buy tickets on EuroMatchTickets?",
      answer: "Buying tickets is simple: 1) Find your event using our search or browse pages, 2) Select your preferred seats from our interactive venue map, 3) Add to cart and proceed to secure checkout, 4) Complete payment with your preferred method, 5) Receive your QR code tickets instantly via email."
    },
    {
      question: "Are the tickets on EuroMatchTickets legitimate?",
      answer: "Yes, absolutely. All tickets on EuroMatchTickets are 100% verified and guaranteed authentic. We verify every seller through a rigorous process including ID verification, transaction history checks, and ongoing monitoring. If any ticket is found to be invalid, you receive a full refund under our Buyer Guarantee."
    },
    {
      question: "Can I choose my specific seats?",
      answer: "Yes! Our interactive venue maps show you exactly where your seats are located. You can browse different sections, see price ranges, and select the exact seats you want. Seat views and section descriptions help you make the best choice."
    },
    {
      question: "What events can I find on EuroMatchTickets?",
      answer: "We cover a wide range of events across Europe including: UEFA Champions League and Europa League matches, Premier League, La Liga, Bundesliga, Serie A football games, Major concerts (Taylor Swift, Coldplay, Ed Sheeran, Drake, etc.), Music festivals, and other live events."
    },
    {
      question: "Can I buy multiple tickets together?",
      answer: "Yes, you can purchase multiple tickets in a single transaction. Our system shows you available ticket quantities, and we ensure seats purchased together are located next to each other so you can enjoy the event with friends and family."
    }
  ],
  payment: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including: Visa, Mastercard, American Express, Apple Pay, Google Pay, and bank transfers for certain regions. All payments are processed securely through Stripe, a PCI-DSS compliant payment provider."
    },
    {
      question: "What is the service fee?",
      answer: "We charge a transparent 10% service fee on all purchases. This fee covers our buyer protection guarantee, secure payment processing, customer support, and platform maintenance. There are no hidden fees - the price you see at checkout is the final price."
    },
    {
      question: "When is my card charged?",
      answer: "Your card is charged immediately upon completing the purchase. This ensures your tickets are secured right away, and you'll receive your QR codes within minutes of payment confirmation."
    },
    {
      question: "Are prices in EUR or my local currency?",
      answer: "All prices are displayed in EUR (Euros). If you're paying with a card in a different currency, your bank will handle the conversion at their current exchange rate."
    },
    {
      question: "Can I get an invoice for my purchase?",
      answer: "Yes, an invoice is automatically sent to your email after each purchase. You can also access all your invoices in your account dashboard. For business purchases requiring specific invoice details, contact our support team."
    }
  ],
  delivery: [
    {
      question: "How will I receive my tickets?",
      answer: "Tickets are delivered digitally as QR codes. Immediately after purchase, you'll receive an email with your tickets. The QR codes are also available in your EuroMatchTickets account. Simply show the QR code on your phone at the venue entrance."
    },
    {
      question: "How long does ticket delivery take?",
      answer: "In most cases, your tickets arrive within minutes of completing your purchase. In rare cases, it may take up to 24 hours. If you haven't received your tickets within 24 hours, contact our support team immediately."
    },
    {
      question: "Do I need to print my tickets?",
      answer: "No printing is required. Our QR code tickets are designed for mobile use. Simply show your phone screen at the venue entrance. However, you can print them if you prefer a physical backup."
    },
    {
      question: "What if I don't receive my tickets?",
      answer: "If you don't receive your tickets within the expected timeframe, contact our support team immediately. We'll investigate and either resend your tickets or provide a full refund under our Buyer Guarantee. We have a 100% delivery success rate."
    },
    {
      question: "Can I transfer tickets to someone else?",
      answer: "Yes, you can forward the QR code email to another person. They can use the same QR code for entry. However, for security reasons, once a ticket is scanned at the venue, it cannot be used again."
    }
  ],
  security: [
    {
      question: "Is it safe to buy tickets on EuroMatchTickets?",
      answer: "Absolutely. We use industry-leading security measures including: SSL encryption for all data transmission, PCI-DSS compliant payment processing through Stripe, Two-factor authentication for accounts, Regular security audits, Verified seller program with ID checks."
    },
    {
      question: "What is the EuroMatchTickets Buyer Guarantee?",
      answer: "Our Buyer Guarantee protects every purchase: If your tickets don't arrive, you get a full refund. If your tickets are invalid or don't grant entry, you get a full refund. If the event is cancelled and not rescheduled, you get a full refund. No questions asked."
    },
    {
      question: "How do you verify sellers?",
      answer: "All sellers undergo strict verification including: Government ID verification, Phone number verification, Bank account verification, Transaction history review, Ongoing monitoring for suspicious activity. We reject approximately 40% of seller applications to maintain quality."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes. We are fully GDPR compliant and take data privacy seriously. Your personal information is encrypted, never sold to third parties, and only used for order processing and communication. You can request data deletion at any time."
    },
    {
      question: "What if I suspect fraud?",
      answer: "If you suspect any fraudulent activity, contact our security team immediately at security@euromatchtickets.com. We have a dedicated fraud prevention team that investigates all reports within 24 hours."
    }
  ]
};

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("buying");
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (index) => {
    setOpenItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Filter FAQs based on search
  const getAllFAQs = () => {
    let allFAQs = [];
    Object.entries(faqData).forEach(([category, questions]) => {
      questions.forEach((faq, index) => {
        allFAQs.push({ ...faq, category, originalIndex: index });
      });
    });
    return allFAQs;
  };

  const filteredFAQs = searchQuery 
    ? getAllFAQs().filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData[activeCategory];

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": getAllFAQs().map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title="Frequently Asked Questions - Help Center"
        description="Find answers to common questions about buying tickets on EuroMatchTickets. Learn about our buyer protection, payment methods, ticket delivery, and security measures."
      />
      
      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="py-16 bg-zinc-900/30 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 text-purple-400" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
          <p className="text-xl text-zinc-400 mb-8">
            Find answers to frequently asked questions about EuroMatchTickets
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          {!searchQuery && (
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-2">
                {faqCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-zinc-900/50 text-zinc-400 border border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    {cat.icon}
                    <span className="font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Content */}
          <div className={searchQuery ? "md:col-span-4" : "md:col-span-3"}>
            {searchQuery && (
              <div className="mb-6 text-zinc-400">
                Found {filteredFAQs.length} results for "{searchQuery}"
              </div>
            )}

            <div className="space-y-4">
              {(Array.isArray(filteredFAQs) ? filteredFAQs : []).map((faq, index) => {
                const itemKey = searchQuery ? `search-${index}` : `${activeCategory}-${index}`;
                return (
                  <div 
                    key={itemKey}
                    className="bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(itemKey)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors"
                    >
                      <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                      <ChevronDown 
                        className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform ${
                          openItems[itemKey] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openItems[itemKey] && (
                      <div className="px-6 pb-6">
                        <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-16 bg-zinc-900/30 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-zinc-400 mb-8">
            Our support team is here to help 24/7
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact"
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
            <a 
              href="mailto:support@euromatchtickets.com"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/10"
            >
              <Mail className="w-5 h-5" />
              support@euromatchtickets.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
