import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import SEOHead from "../components/SEOHead";

// Blog article content - In production, this would come from a CMS
const articleContent = {
  "best-seats-santiago-bernabeu": {
    title: "Best Seats at Santiago Bernabéu: Complete Guide 2025",
    metaDescription: "Discover the best seating sections at Real Madrid's Santiago Bernabéu stadium. VIP boxes, lower tiers, and atmosphere zones explained.",
    image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
    category: "Stadium Guides",
    readTime: "8 min read",
    date: "2025-02-15",
    author: "EuroMatchTickets Team",
    content: `
      <p>The Santiago Bernabéu is one of the most iconic football stadiums in the world. Home to Real Madrid, this legendary venue has witnessed countless historic moments. If you're planning to attend a match, choosing the right seats can make all the difference.</p>
      
      <h2>Understanding the Stadium Layout</h2>
      <p>After its recent renovation, the Bernabéu now features a retractable roof and state-of-the-art facilities. The stadium is divided into several tiers:</p>
      <ul>
        <li><strong>Lower Tier (Grada Baja):</strong> Closest to the pitch, offering the most immersive experience</li>
        <li><strong>Middle Tier (Grada Media):</strong> Great balance of view and atmosphere</li>
        <li><strong>Upper Tier (Grada Alta):</strong> Panoramic views of the entire pitch</li>
      </ul>
      
      <h2>Best Sections for Different Experiences</h2>
      
      <h3>For the Best Atmosphere: South Stand (Fondo Sur)</h3>
      <p>The Fondo Sur is where Real Madrid's most passionate supporters gather. Known as "Ultras Sur" territory, this is where you'll find non-stop chanting, incredible tifos, and the most electric atmosphere in the stadium. Be prepared to stand for most of the match!</p>
      
      <h3>For the Best View: Lateral Oeste or Este</h3>
      <p>The lateral (side) sections offer the classic "TV angle" view that most fans are familiar with. Sections in the middle of these areas provide excellent sightlines to both goals and the entire pitch.</p>
      
      <h3>For VIP Experience: Palco VIP</h3>
      <p>If budget isn't a concern, the VIP boxes offer premium seating, exclusive catering, and unmatched comfort. These are located in the central sections and provide the ultimate matchday experience.</p>
      
      <h2>Price Ranges to Expect</h2>
      <p>Ticket prices at the Bernabéu vary significantly based on the opponent and competition:</p>
      <ul>
        <li><strong>La Liga (smaller teams):</strong> €50 - €150</li>
        <li><strong>La Liga (El Clasico):</strong> €300 - €1,500+</li>
        <li><strong>Champions League group stage:</strong> €80 - €250</li>
        <li><strong>Champions League knockout rounds:</strong> €150 - €600+</li>
      </ul>
      
      <h2>Tips for Buying Tickets</h2>
      <ol>
        <li>Book early - major matches sell out quickly</li>
        <li>Use verified resale platforms like EuroMatchTickets</li>
        <li>Check the section carefully before purchasing</li>
        <li>Consider the sun position for afternoon matches</li>
      </ol>
      
      <h2>Getting to the Stadium</h2>
      <p>The stadium is located in the heart of Madrid and is easily accessible by metro (Santiago Bernabéu station on Line 10). Arrive at least 90 minutes early for big matches to soak in the pre-match atmosphere.</p>
    `,
    relatedArticles: ["el-clasico-atmosphere-guide", "how-to-buy-champions-league-tickets-safely"]
  },
  "how-to-buy-champions-league-tickets-safely": {
    title: "How to Buy Champions League Tickets Safely in 2025",
    metaDescription: "Learn how to safely purchase UEFA Champions League tickets. Avoid scams and get verified tickets for Europe's biggest football matches.",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
    category: "Buying Tips",
    readTime: "6 min read",
    date: "2025-02-10",
    author: "EuroMatchTickets Team",
    content: `
      <p>The UEFA Champions League is the pinnacle of European club football, and millions of fans dream of attending these matches. However, with high demand comes increased risk of scams. Here's your complete guide to buying Champions League tickets safely.</p>
      
      <h2>Official Channels</h2>
      <p>The safest way to buy tickets is through official channels:</p>
      <ul>
        <li><strong>Club websites:</strong> Each participating club sells tickets to their home matches</li>
        <li><strong>UEFA.com:</strong> For finals and special matches</li>
        <li><strong>Official ticket partners:</strong> Clubs often have authorized resellers</li>
      </ul>
      
      <h2>Trusted Resale Platforms</h2>
      <p>When official tickets are sold out, trusted resale platforms are your next best option. Look for platforms that offer:</p>
      <ul>
        <li>Buyer guarantee/protection</li>
        <li>Verified seller programs</li>
        <li>Secure payment processing</li>
        <li>Customer support</li>
      </ul>
      <p>EuroMatchTickets offers all of these features, ensuring a safe buying experience for Champions League matches.</p>
      
      <h2>Red Flags to Watch For</h2>
      <p>Avoid these warning signs that indicate a potential scam:</p>
      <ul>
        <li>Prices that seem too good to be true</li>
        <li>Sellers requesting payment via bank transfer or cryptocurrency</li>
        <li>Social media sellers with no verification</li>
        <li>Pressure to buy immediately without time to verify</li>
        <li>Blurry or photoshopped ticket images</li>
      </ul>
      
      <h2>Payment Safety</h2>
      <p>Always use secure payment methods:</p>
      <ul>
        <li>Credit cards (offer chargeback protection)</li>
        <li>PayPal (buyer protection available)</li>
        <li>Platform-processed payments (never pay directly to sellers)</li>
      </ul>
      
      <h2>Verify Before the Match</h2>
      <p>Once you receive your tickets, verify them by:</p>
      <ul>
        <li>Checking the QR code or barcode</li>
        <li>Confirming the match details and seat information</li>
        <li>Contacting the platform's support if anything seems wrong</li>
      </ul>
      
      <h2>What to Do If You're Scammed</h2>
      <p>If you believe you've been scammed:</p>
      <ol>
        <li>Contact your payment provider immediately</li>
        <li>Report to local authorities</li>
        <li>File a complaint with consumer protection agencies</li>
        <li>Report the seller/platform to relevant authorities</li>
      </ol>
    `,
    relatedArticles: ["best-seats-santiago-bernabeu", "premier-league-away-days-guide"]
  },
  "is-it-safe-to-buy-resale-concert-tickets": {
    title: "Is It Safe to Buy Resale Concert Tickets? Your Complete Guide",
    metaDescription: "Everything you need to know about buying resale concert tickets safely. Identify legitimate sellers and understand your buyer protections.",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    category: "Buying Tips",
    readTime: "5 min read",
    date: "2025-02-05",
    author: "EuroMatchTickets Team",
    content: `
      <p>Missed out on tickets for your favorite artist? The resale market can be a great option, but it's important to know how to buy safely. Here's everything you need to know about purchasing resale concert tickets.</p>
      
      <h2>Is Resale Legal?</h2>
      <p>Yes, in most European countries, reselling tickets is completely legal. However, some events may have specific terms that restrict transfers. Always check the original ticket terms before purchasing resale tickets.</p>
      
      <h2>Choosing a Safe Platform</h2>
      <p>The platform you choose matters significantly. Safe platforms offer:</p>
      <ul>
        <li><strong>Buyer Guarantees:</strong> Refund if tickets are invalid</li>
        <li><strong>Verified Sellers:</strong> Background checks on sellers</li>
        <li><strong>Secure Payments:</strong> Your payment information is protected</li>
        <li><strong>Customer Support:</strong> Help when you need it</li>
      </ul>
      
      <h2>Understanding Pricing</h2>
      <p>Resale prices fluctuate based on demand. Factors affecting price include:</p>
      <ul>
        <li>Artist popularity</li>
        <li>Venue size and location</li>
        <li>Time until the event</li>
        <li>Seat location</li>
      </ul>
      <p>Prices often drop closer to the event date as sellers become more motivated to sell.</p>
      
      <h2>Delivery Methods</h2>
      <p>Modern concert tickets are typically delivered as:</p>
      <ul>
        <li><strong>Mobile tickets:</strong> QR codes sent to your phone</li>
        <li><strong>PDF tickets:</strong> Printable tickets via email</li>
        <li><strong>App transfers:</strong> Transferred through the venue's official app</li>
      </ul>
      
      <h2>Our Recommendation</h2>
      <p>Buying resale concert tickets is safe when you use trusted platforms with buyer protection. At EuroMatchTickets, we verify every seller and guarantee your tickets will work at the venue.</p>
    `,
    relatedArticles: ["taylor-swift-eras-tour-europe-2025", "how-to-buy-champions-league-tickets-safely"]
  }
};

// Default article for unmatched IDs
const defaultArticle = {
  title: "Article Coming Soon",
  metaDescription: "This article is coming soon to EuroMatchTickets blog.",
  image: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
  category: "General",
  readTime: "5 min read",
  date: new Date().toISOString().split('T')[0],
  author: "EuroMatchTickets Team",
  content: "<p>This article is being prepared. Check back soon for expert tips and guides!</p>",
  relatedArticles: []
};

const BlogArticlePage = () => {
  const { articleId } = useParams();
  const article = articleContent[articleId] || defaultArticle;

  useEffect(() => {
    document.title = `${article.title} | EuroMatchTickets Blog`;
    window.scrollTo(0, 0);
  }, [article.title]);

  const shareUrl = `https://euromatchtickets.com/blog/${articleId}`;

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <SEOHead 
        title={article.title}
        description={article.metaDescription}
        image={article.image}
        type="article"
        article={{
          publishedTime: article.date,
          author: article.author,
          section: article.category
        }}
      />

      {/* Article Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.metaDescription,
        "image": article.image,
        "author": {
          "@type": "Organization",
          "name": article.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "EuroMatchTickets",
          "logo": {
            "@type": "ImageObject",
            "url": "https://euromatchtickets.com/logo.png"
          }
        },
        "datePublished": article.date,
        "dateModified": article.date
      })}} />

      {/* Hero */}
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
        
        <div className="relative z-10 h-full max-w-[900px] mx-auto px-4 flex flex-col justify-end pb-12">
          <Link to="/blog" className="flex items-center gap-2 text-purple-400 mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full w-fit mb-4">
            {article.category}
          </span>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-6 text-zinc-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-[900px] mx-auto px-4 py-12">
        <article 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:text-zinc-300 prose-ol:text-zinc-300
            prose-li:mb-2
            prose-strong:text-white
            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-400">Share this article:</span>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Buy Tickets?</h3>
          <p className="text-zinc-400 mb-6">
            Browse thousands of verified tickets for football matches and concerts across Europe.
          </p>
          <Link to="/events">
            <Button className="btn-accent">
              Explore Events
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {article.relatedArticles.map(id => {
                const related = articleContent[id];
                if (!related) return null;
                return (
                  <Link 
                    key={id}
                    to={`/blog/${id}`}
                    className="group bg-zinc-900/50 border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition-all flex gap-4"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-purple-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <span className="text-sm text-zinc-500">{related.readTime}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogArticlePage;
