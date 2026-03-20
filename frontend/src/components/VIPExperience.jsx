import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Wine, Utensils, Eye, Shield, Zap, ChevronRight, Check, Sparkles, Users, Lock, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const VIP_IMAGES = {
  skybox: "https://static.prod-images.emergentagent.com/jobs/6de94a4e-fc0b-4744-9068-70dd99b1908f/images/c760532fb7f522cf223ca9076b03701ae31acda3a3adaeef242effe0691fcf41.png",
  ringside: "https://static.prod-images.emergentagent.com/jobs/6de94a4e-fc0b-4744-9068-70dd99b1908f/images/ece8aee1d5fe62a03d262cd99d1499f8d9f5f045799524e1715637b51a159669.png",
  terrace: "https://static.prod-images.emergentagent.com/jobs/6de94a4e-fc0b-4744-9068-70dd99b1908f/images/33e10ca933888320939c2449c0ba2a55d14d0c756936470a9ca390ec559eb4ac.png",
  champagne: "https://static.prod-images.emergentagent.com/jobs/6de94a4e-fc0b-4744-9068-70dd99b1908f/images/cc974575bc399d9ee738c17702d10896af562797d7d8d1e78d78363d3fd9461f.png",
};

const VIPImageGallery = () => {
  const [active, setActive] = useState(0);
  const imgs = [
    { src: VIP_IMAGES.skybox, label: "Private Skybox Suite" },
    { src: VIP_IMAGES.ringside, label: "Ringside VIP Seats" },
    { src: VIP_IMAGES.terrace, label: "Rooftop Terrace Lounge" },
    { src: VIP_IMAGES.champagne, label: "Champagne & Fine Dining" },
  ];

  return (
    <div className="space-y-3" data-testid="vip-gallery">
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={imgs[active].src}
            alt={imgs[active].label}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white font-bold text-lg">{imgs[active].label}</p>
        </div>
        <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full tracking-wider">
          VIP EXCLUSIVE
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {imgs.map((img, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`relative rounded-lg overflow-hidden aspect-[16/10] transition-all ${
              i === active ? "ring-2 ring-amber-500 brightness-100" : "brightness-50 hover:brightness-75"
            }`}>
            <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const VIPPerks = () => {
  const perks = [
    { icon: Eye, title: "Panoramic Views", desc: "Floor-to-ceiling glass overlooking the pitch", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-500" },
    { icon: Utensils, title: "Gourmet Dining", desc: "5-star chef-prepared multi-course meals", color: "from-rose-500/20 to-rose-600/10", iconColor: "text-rose-500" },
    { icon: Wine, title: "Premium Open Bar", desc: "Dom Perignon, Macallan, Chateau Margaux", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-500" },
    { icon: Users, title: "Private Suite", desc: "10-20 person private suite with host", color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-500" },
    { icon: Gift, title: "Welcome Package", desc: "Exclusive merchandise and commemorative program", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-500" },
    { icon: Lock, title: "Priority Access", desc: "VIP entrance, no queues, private parking", color: "from-slate-500/20 to-slate-600/10", iconColor: "text-slate-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="vip-perks">
      {perks.map((p, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className={`bg-gradient-to-br ${p.color} border border-white/5 rounded-xl p-4 backdrop-blur-sm`}>
          <p.icon className={`w-5 h-5 ${p.iconColor} mb-2`} />
          <h4 className="font-bold text-white text-sm">{p.title}</h4>
          <p className="text-white/40 text-[11px] mt-0.5 leading-snug">{p.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

const VIPExperienceSection = ({ event, vipTickets, onBuy }) => {
  if (!vipTickets || vipTickets.length === 0) return null;

  const lowestVIP = Math.round(Math.min(...vipTickets.map(t => t.lowest_price)));
  const highestVIP = Math.round(Math.max(...vipTickets.map(t => t.highest_price)));
  const totalVIP = vipTickets.reduce((s, t) => s + t.count, 0);

  return (
    <section className="relative rounded-2xl overflow-hidden" data-testid="vip-experience-section">
      {/* Dark premium background */}
      <div className="bg-[#0c0a14] p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
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

        {/* Image Gallery */}
        <VIPImageGallery />

        {/* Perks Grid */}
        <VIPPerks />

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
              className="bg-white/[0.03] border border-amber-500/10 hover:border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
              data-testid={`vip-tier-${i}`}>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{tier.section} &middot; {tier.category === 'platinum' ? 'Platinum' : 'VIP'}</h4>
                    {tier.count < 10 && <span className="text-[9px] font-black bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">LAST {tier.count}</span>}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    {["Private suite", "Gourmet dining", "Premium bar", "VIP entrance"].map((f, j) => (
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
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40"
                  data-testid={`vip-buy-${i}`}>
                  Buy VIP
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-4 border-t border-white/5 text-[11px] text-white/30">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> FanProtect Guarantee</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Instant QR Delivery</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> 4.8/5 from VIP guests</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-400" /> Secure Checkout</span>
        </div>
      </div>
    </section>
  );
};

export { VIPExperienceSection, VIPImageGallery, VIPPerks, VIP_IMAGES };
export default VIPExperienceSection;
