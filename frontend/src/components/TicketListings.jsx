import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, ChevronDown, ChevronUp, Shield, Zap, Users, Check, Filter, SortAsc, Tag, Crown } from "lucide-react";

const CATEGORY_LABELS = {
  platinum: "Platinum",
  vip: "VIP",
  seated: "Seated",
  general_admission: "General Admission",
  standard: "Standard",
};

const CATEGORY_ORDER = { platinum: 0, vip: 1, seated: 2, general_admission: 3, standard: 4 };

function formatCategory(cat) {
  return CATEGORY_LABELS[cat] || cat.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

const SectionTicketList = ({ group, eventId, onBuy }) => {
  const [expanded, setExpanded] = useState(false);
  const sortedTickets = useMemo(() =>
    [...group.tickets].sort((a, b) => a.price - b.price),
  [group.tickets]);

  const isLow = group.count < 10;
  const catLabel = formatCategory(group.category);
  const isVIP = group.category === 'vip' || group.category === 'platinum';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden hover:shadow-sm transition-all ${
        isVIP
          ? 'bg-gradient-to-r from-[#0c0a14] to-[#15111f] border border-amber-500/20 hover:border-amber-500/40'
          : 'bg-white border border-slate-100 hover:border-slate-200'
      }`}
      data-testid={`section-${group.category}-${group.section.toLowerCase().replace(/\s/g,'-')}`}
    >
      {/* Section Header Row */}
      <div className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)} data-testid={`section-toggle-${group.section.toLowerCase().replace(/\s/g,'-')}`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isVIP ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10' : 'bg-slate-50'
          }`}>
            {isVIP ? <Crown className="w-5 h-5 text-amber-500" /> : <Ticket className="w-5 h-5 text-slate-600" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-bold text-sm ${isVIP ? 'text-white' : 'text-slate-900'}`}>{group.section}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isVIP ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-500 bg-slate-100'
              }`}>{catLabel}</span>
              {isLow && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">LOW STOCK</span>}
            </div>
            <p className={`text-xs mt-0.5 ${isVIP ? 'text-white/40' : 'text-slate-400'}`}>{group.count} ticket{group.count !== 1 ? 's' : ''} available{isVIP ? ' · VIP Hospitality included' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className={`text-[10px] uppercase tracking-wide ${isVIP ? 'text-amber-500/60' : 'text-slate-400'}`}>From</p>
            <p className={`text-lg font-extrabold ${isVIP ? 'text-amber-400' : 'text-emerald-600'}`}>&euro;{Math.round(group.lowest_price).toLocaleString()}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(sortedTickets[0]); }}
            className={`font-bold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md hidden sm:block ${
              isVIP
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
            data-testid={`buy-quick-${group.section.toLowerCase().replace(/\s/g,'-')}`}
          >
            {isVIP ? 'Buy VIP' : 'Buy'}
          </button>
          <div className={isVIP ? 'text-white/40' : 'text-slate-400'}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Mobile Buy Button */}
      <div className="px-4 pb-3 sm:hidden">
        <button
          onClick={() => onBuy(sortedTickets[0])}
          className={`w-full font-bold text-sm py-2.5 rounded-lg transition-all ${
            isVIP
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
          data-testid={`buy-quick-mobile-${group.section.toLowerCase().replace(/\s/g,'-')}`}
        >
          {isVIP ? `Buy VIP from €${Math.round(group.lowest_price).toLocaleString()}` : `Buy from €${Math.round(group.lowest_price)}`}
        </button>
      </div>

      {/* Expanded Ticket List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 bg-slate-50/50">
              <div className="px-4 py-2 grid grid-cols-[1fr_auto_auto] gap-4 text-[10px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <span>Ticket</span>
                <span>Price</span>
                <span className="w-20"></span>
              </div>
              {sortedTickets.map((ticket, i) => (
                <div key={ticket.ticket_id}
                  className="px-4 py-3 grid grid-cols-[1fr_auto_auto] gap-4 items-center border-b border-slate-50 last:border-0 hover:bg-white transition-colors"
                  data-testid={`ticket-row-${ticket.ticket_id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{group.section} &middot; {catLabel}</p>
                      <p className="text-[11px] text-slate-400">Verified &middot; Instant QR delivery</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">&euro;{ticket.price.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400">each</p>
                  </div>
                  <button
                    onClick={() => onBuy(ticket)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all w-20"
                    data-testid={`buy-ticket-${ticket.ticket_id}`}
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TicketListings = ({ groupedSections, eventId, selectedSection, onClearFilter }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("price_low");
  const [filterCategory, setFilterCategory] = useState(null);

  const filteredSections = useMemo(() => {
    let sections = groupedSections || [];
    if (selectedSection) {
      sections = sections.filter(s => s.section === selectedSection);
    }
    if (filterCategory) {
      sections = sections.filter(s => s.category === filterCategory);
    }
    if (sortBy === "price_low") {
      sections = [...sections].sort((a, b) => a.lowest_price - b.lowest_price);
    } else if (sortBy === "price_high") {
      sections = [...sections].sort((a, b) => b.lowest_price - a.lowest_price);
    } else if (sortBy === "availability") {
      sections = [...sections].sort((a, b) => b.count - a.count);
    }
    return sections;
  }, [groupedSections, selectedSection, filterCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = new Set();
    (groupedSections || []).forEach(s => cats.add(s.category));
    return [...cats].sort((a, b) => (CATEGORY_ORDER[a] || 9) - (CATEGORY_ORDER[b] || 9));
  }, [groupedSections]);

  const totalTickets = filteredSections.reduce((sum, s) => sum + s.count, 0);
  const lowestPrice = filteredSections.length > 0
    ? Math.round(Math.min(...filteredSections.map(s => s.lowest_price)))
    : 0;

  const handleBuy = (ticket) => {
    navigate(`/checkout?event=${eventId}&category=${formatCategory(ticket.category)}&price=${Math.round(ticket.price)}&ticket_id=${ticket.ticket_id}`);
  };

  if (!groupedSections || groupedSections.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200" data-testid="no-tickets">
        <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No tickets available for this event</p>
      </div>
    );
  }

  return (
    <div data-testid="ticket-listings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-600" />
            {totalTickets} Tickets Available
          </h2>
          {lowestPrice > 0 && <p className="text-sm text-slate-500 mt-0.5">Starting from &euro;{lowestPrice}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            data-testid="sort-tickets">
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="availability">Most Available</option>
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => { setFilterCategory(null); if (onClearFilter) onClearFilter(); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            !filterCategory && !selectedSection ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
          }`} data-testid="filter-all">
          All Tickets
        </button>
        {categories.map(cat => (
          <button key={cat}
            onClick={() => { setFilterCategory(filterCategory === cat ? null : cat); if (onClearFilter) onClearFilter(); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`} data-testid={`filter-${cat}`}>
            {formatCategory(cat)}
          </button>
        ))}
      </div>

      {/* Active filter */}
      {selectedSection && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700" data-testid="active-filter">
          <Filter className="w-4 h-4" />
          Showing: <strong>{selectedSection}</strong>
          <button onClick={onClearFilter} className="ml-auto text-emerald-600 hover:text-emerald-800 text-xs font-bold">Clear</button>
        </div>
      )}

      {/* Ticket Sections */}
      <div className="space-y-2">
        {filteredSections.map((group, i) => (
          <SectionTicketList key={`${group.category}-${group.section}`} group={group} eventId={eventId} onBuy={handleBuy} />
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No tickets found for this filter. Try a different section or category.
        </div>
      )}

      {/* Trust Bar */}
      <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" /> FanProtect Guarantee</span>
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 100% Verified</span>
        <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant QR Delivery</span>
        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> 50,000+ Happy Fans</span>
      </div>
    </div>
  );
};

export default TicketListings;
