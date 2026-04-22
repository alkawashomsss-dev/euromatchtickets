import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Wine, Utensils, Eye, Shield, Zap, Check, Sparkles, Users, Lock, Gift, Music, Flag, Bike } from "lucide-react";

/* ─── Event-Specific VIP Image & Description Maps ─── */
const VIP_CONFIGS = {
  f1: {
    images: [
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/5cb20c6492be13cb69ae5c45587d61ce3e5a05bfee99232053c912c06464c07b.png", label: "F1 Paddock Club Hospitality" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/d84430a95323b820d9a6d93e1758ca35eab8a9f595c089743ffc70391dc84381.png", label: "Pit Lane Walk Access" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a59e7d844022a7c2f36d5d7816e3c37b98b18ec416efeea3c2e85ab084323068.png", label: "Michelin-Star Dining" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/ab1e7b7e008b41b5dbc14a24bb83e208c440cb11a06103486f0c7e2e7936e0d3.png", label: "Trackside VIP Terrace" },
    ],
    perks: [
      { icon: Eye, title: "Paddock Club Views", desc: "Panoramic glass-front lounge directly above the pit lane", color: "from-red-500/20 to-red-600/10", iconColor: "text-red-500" },
      { icon: Utensils, title: "Michelin-Star Dining", desc: "Multi-course gourmet meals by world-renowned chefs", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-500" },
      { icon: Wine, title: "Premium Champagne Bar", desc: "Dom Perignon, Veuve Clicquot & finest spirits all day", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-500" },
      { icon: Flag, title: "Pit Lane Walk", desc: "Exclusive access to the pit lane before the race start", color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-500" },
      { icon: Users, title: "Driver Meet & Greet", desc: "Chance to meet F1 drivers and team principals", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-500" },
      { icon: Lock, title: "VIP Priority Access", desc: "Dedicated entrance, private parking & fast-track security", color: "from-slate-500/20 to-slate-600/10", iconColor: "text-slate-400" },
    ],
    tierFeatures: ["Paddock Club access", "Pit lane walk", "Open champagne bar", "Driver appearances"],
    badge: "PADDOCK CLUB",
  },
  football: {
    images: [
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a9213bf9268b0e195b3302f71b60a3ec3f536b94bd8124efec72d009718801dd.png", label: "Executive Skybox Suite" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/4a453129694d72099f25b2e2e796109efd57a38904bdceb1ae161b37cc6be6c5.png", label: "VIP Red Carpet Entrance" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a59e7d844022a7c2f36d5d7816e3c37b98b18ec416efeea3c2e85ab084323068.png", label: "Gourmet Match Day Dining" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/5cb20c6492be13cb69ae5c45587d61ce3e5a05bfee99232053c912c06464c07b.png", label: "Pitch-View Hospitality" },
    ],
    perks: [
      { icon: Eye, title: "Pitch-Side Views", desc: "Floor-to-ceiling glass overlooking the entire pitch", color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-500" },
      { icon: Utensils, title: "3-Course Pre-Match Meal", desc: "Fine dining with half-time refreshments and dessert", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-500" },
      { icon: Wine, title: "All-Inclusive Open Bar", desc: "Premium wines, beers, cocktails & soft drinks all match", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-500" },
      { icon: Users, title: "Private Executive Box", desc: "10-20 person suite with personal host and TV screens", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-500" },
      { icon: Gift, title: "Match Day Programme", desc: "Exclusive merchandise, signed memorabilia opportunities", color: "from-rose-500/20 to-rose-600/10", iconColor: "text-rose-500" },
      { icon: Lock, title: "VIP Entrance & Parking", desc: "Dedicated entrance, reserved parking, no queues", color: "from-slate-500/20 to-slate-600/10", iconColor: "text-slate-400" },
    ],
    tierFeatures: ["Private executive box", "3-course dining", "Open bar included", "VIP entrance"],
    badge: "VIP HOSPITALITY",
  },
  concert: {
    images: [
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/0e3e0b3530249bb352a6d918a417a2113c577df5ab54410053419408e992e8e2.png", label: "VIP Backstage Lounge" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/cfabbea7c8e59c5122ea5e3cdc9c8d9733c939c93919cb1120c3efa8621770b0.png", label: "Elevated VIP Platform" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a59e7d844022a7c2f36d5d7816e3c37b98b18ec416efeea3c2e85ab084323068.png", label: "Premium Dining Experience" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/4a453129694d72099f25b2e2e796109efd57a38904bdceb1ae161b37cc6be6c5.png", label: "VIP Red Carpet Entry" },
    ],
    perks: [
      { icon: Music, title: "Front Stage Access", desc: "Dedicated viewing area closest to the stage", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-500" },
      { icon: Wine, title: "VIP Open Bar", desc: "Cocktails, premium spirits, champagne & soft drinks", color: "from-pink-500/20 to-pink-600/10", iconColor: "text-pink-500" },
      { icon: Eye, title: "Elevated Platform", desc: "Raised VIP viewing deck with unobstructed sight lines", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-500" },
      { icon: Users, title: "Backstage Lounge", desc: "Exclusive backstage area with artist memorabilia", color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-500" },
      { icon: Gift, title: "VIP Welcome Pack", desc: "Exclusive merch, lanyard, commemorative programme", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-500" },
      { icon: Lock, title: "Fast-Track Entry", desc: "Skip the queue with dedicated VIP entrance lane", color: "from-slate-500/20 to-slate-600/10", iconColor: "text-slate-400" },
    ],
    tierFeatures: ["Front stage access", "Backstage lounge", "Open bar all night", "Fast-track entry"],
    badge: "VIP ACCESS",
  },
  motogp: {
    images: [
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/ab1e7b7e008b41b5dbc14a24bb83e208c440cb11a06103486f0c7e2e7936e0d3.png", label: "MotoGP VIP Village" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/d84430a95323b820d9a6d93e1758ca35eab8a9f595c089743ffc70391dc84381.png", label: "Garage & Pit Access" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/a59e7d844022a7c2f36d5d7816e3c37b98b18ec416efeea3c2e85ab084323068.png", label: "Premium Trackside Dining" },
      { src: "https://static.prod-images.emergentagent.com/jobs/24ccd820-89b3-44a4-a0f8-a7e572fe73c9/images/5cb20c6492be13cb69ae5c45587d61ce3e5a05bfee99232053c912c06464c07b.png", label: "Hospitality Lounge" },
    ],
    perks: [
      { icon: Bike, title: "VIP Village Access", desc: "Trackside hospitality with panoramic race views", color: "from-orange-500/20 to-orange-600/10", iconColor: "text-orange-500" },
      { icon: Utensils, title: "All-Day Gourmet Buffet", desc: "International cuisine, live cooking stations & desserts", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-500" },
      { icon: Wine, title: "Open Bar All Day", desc: "Premium wines, beer, cocktails from race start to finish", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-500" },
      { icon: Flag, title: "Pit Lane Tour", desc: "Guided walk through the MotoGP pit lane & garages", color: "from-red-500/20 to-red-600/10", iconColor: "text-red-500" },
      { icon: Users, title: "Rider Appearances", desc: "Meet MotoGP riders and collect autographs in VIP Village", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-500" },
      { icon: Lock, title: "Priority Entrance", desc: "VIP-only entrance, reserved seating, private facilities", color: "from-slate-500/20 to-slate-600/10", iconColor: "text-slate-400" },
    ],
    tierFeatures: ["VIP Village access", "Pit lane tour", "Open bar all day", "Rider meet & greet"],
    badge: "VIP VILLAGE",
  },
};

/* Detect event category from event object or slug */
const detectCategory = (event) => {
  if (!event) return 'football';
  const title = (event.title || event.name || '').toLowerCase();
  const cat = (event.category || event.event_type || '').toLowerCase();
  if (cat.includes('f1') || cat.includes('formula') || title.includes('f1') || title.includes('formula') || title.includes('grand prix') || title.includes('gp ')) return 'f1';
  if (cat.includes('motogp') || cat.includes('moto gp') || title.includes('motogp') || title.includes('isle of man')) return 'motogp';
  if (cat.includes('concert') || cat.includes('music') || cat.includes('tour') || title.includes('tour') || title.includes('concert') || title.includes('festival')) return 'concert';
  return 'football';
};

const VIPImageGallery = ({ images }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3" data-testid="vip-gallery">
      <div className="relative rounded-none overflow-hidden aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active].src}
            alt={images[active].label}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white font-bold text-lg">{images[active].label}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`relative rounded-none overflow-hidden aspect-[16/10] transition-all ${
              i === active ? "ring-2 ring-amber-500 brightness-100" : "brightness-50 hover:brightness-75"
            }`}>
            <img src={img.src} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

const VIPPerks = ({ perks }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="vip-perks">
    {perks.map((p, i) => (
      <motion.div key={i}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.08 }}
        className={`bg-gradient-to-br ${p.color} border border-white/5 rounded-none p-4 backdrop-blur-sm`}>
        <p.icon className={`w-5 h-5 ${p.iconColor} mb-2`} />
        <h4 className="font-bold text-white text-sm">{p.title}</h4>
        <p className="text-white/40 text-[11px] mt-0.5 leading-snug">{p.desc}</p>
      </motion.div>
    ))}
  </div>
);

const VIPExperienceSection = ({ event, vipTickets, onBuy }) => {
  if (!vipTickets || vipTickets.length === 0) return null;

  const category = detectCategory(event);
  const config = VIP_CONFIGS[category] || VIP_CONFIGS.football;

  const lowestVIP = Math.round(Math.min(...vipTickets.map(t => t.lowest_price)));
  const highestVIP = Math.round(Math.max(...vipTickets.map(t => t.highest_price)));
  const totalVIP = vipTickets.reduce((s, t) => s + t.count, 0);

  return (
    <section className="relative rounded-none overflow-hidden" data-testid="vip-experience-section">
      <div className="bg-[#0c0a14] p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-none flex items-center justify-center">
                <Crown className="w-4 h-4 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">VIP Experience</h2>
                <p className="text-amber-500/80 text-xs font-medium">The Ultimate Premium Package</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">From</p>
            <p className="text-2xl font-black text-amber-400">&euro;{lowestVIP.toLocaleString()}</p>
            {highestVIP > lowestVIP && <p className="text-[10px] text-white/30">up to &euro;{highestVIP.toLocaleString()}</p>}
          </div>
        </div>

        {/* Event-Specific Image Gallery */}
        <VIPImageGallery images={config.images} />

        {/* Event-Specific Perks Grid */}
        <VIPPerks perks={config.perks} />

        {/* VIP Ticket Tiers */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Available VIP Packages ({totalVIP} left)
          </h3>
          {vipTickets.map((tier, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/30 rounded-none p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
              data-testid={`vip-tier-${i}`}>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-none bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{tier.section} &middot; {tier.category === 'platinum' ? 'Platinum' : 'VIP'}</h4>
                    {tier.count < 10 && <span className="text-[9px] font-black bg-[#e10600]/100/20 text-red-400 px-2 py-0.5 rounded-full">LAST {tier.count}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    {config.tierFeatures.map((f, j) => (
                      <span key={j} className="text-[10px] text-white/30 flex items-center gap-1"><Check className="w-2.5 h-2.5 text-amber-500/70" />{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-black text-white">&euro;{Math.round(tier.lowest_price).toLocaleString()}</p>
                  <p className="text-[10px] text-white/30">{tier.count} available</p>
                </div>
                <button onClick={() => onBuy && onBuy(tier)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm px-5 py-2.5 rounded-none transition-all shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40"
                  data-testid={`vip-buy-${i}`}>
                  Buy VIP
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-4 border-t border-white/5 text-[11px] text-white/30">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> Buyer protection</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> QR ticket delivery</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> 4.8/5 from VIP guests</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-400" /> Secure Checkout</span>
        </div>
      </div>
    </section>
  );
};

export { VIPExperienceSection, VIPImageGallery, VIPPerks, VIP_CONFIGS, detectCategory };
export default VIPExperienceSection;
