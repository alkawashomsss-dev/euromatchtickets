import { useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Clock, Download, Ticket, Shield } from "lucide-react";
import { Button } from "./ui/button";

const categoryColors = {
  vip: { bg: "bg-amber-500", text: "text-amber-500", accent: "#f59e0b" },
  VIP: { bg: "bg-amber-500", text: "text-amber-500", accent: "#f59e0b" },
  premium: { bg: "bg-purple-500", text: "text-purple-500", accent: "#a855f7" },
  Premium: { bg: "bg-purple-500", text: "text-purple-500", accent: "#a855f7" },
  cat1: { bg: "bg-cyan-500", text: "text-cyan-500", accent: "#06b6d4" },
  cat2: { bg: "bg-emerald-500", text: "text-emerald-500", accent: "#10b981" },
  cat3: { bg: "bg-zinc-400", text: "text-slate-500", accent: "#a1a1aa" },
  standard: { bg: "bg-blue-500", text: "text-blue-500", accent: "#3b82f6" },
  Standard: { bg: "bg-blue-500", text: "text-blue-500", accent: "#3b82f6" },
  floor: { bg: "bg-pink-500", text: "text-pink-500", accent: "#ec4899" },
  standing: { bg: "bg-zinc-400", text: "text-slate-500", accent: "#a1a1aa" },
  grandstand: { bg: "bg-cyan-500", text: "text-cyan-500", accent: "#06b6d4" },
  general_admission: { bg: "bg-zinc-400", text: "text-slate-500", accent: "#a1a1aa" },
  hospitality: { bg: "bg-amber-500", text: "text-amber-500", accent: "#f59e0b" },
  paddock_club: { bg: "bg-amber-600", text: "text-amber-600", accent: "#d97706" },
};

const eventTypeIcons = {
  match: { emoji: "⚽", label: "FOOTBALL" },
  concert: { emoji: "🎵", label: "CONCERT" },
  f1: { emoji: "🏎️", label: "FORMULA 1" },
  motogp: { emoji: "🏍️", label: "MOTOGP" },
  worldcup: { emoji: "🏆", label: "WORLD CUP" },
};

const formatTicketDate = (dateStr) => {
  if (!dateStr) return { day: "--", date: "--", month: "---", year: "----", time: "--:--", full: "" };
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    date: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    full: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
};

export const ProfessionalTicket = ({ order, compact = false }) => {
  const ticketRef = useRef(null);
  const event = order?.event;
  const ticket = order?.ticket;
  const eventType = event?.event_type || "concert";
  const category = ticket?.category || "standard";
  const colors = categoryColors[category] || categoryColors.standard;
  const typeInfo = eventTypeIcons[eventType] || eventTypeIcons.concert;
  const dateInfo = formatTicketDate(event?.event_date);
  const qrData = `EUROMATCH-${order?.order_id}-${order?.ticket_id}`;
  const orderId = order?.order_id || "---";
  const shortId = orderId.slice(-8).toUpperCase();

  const handleDownload = useCallback(() => {
    const el = ticketRef.current;
    if (!el) return;
    // Use html2canvas-like approach via SVG serialization
    // For now, trigger print
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>EuroMatchTickets - ${event?.title || "Ticket"}</title>
      <style>
        body { margin: 0; padding: 40px; background: #f5f5f5; font-family: 'Segoe UI', system-ui, sans-serif; }
        .ticket { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
        .ticket-header { background: linear-gradient(135deg, #18181b, #27272a); color: white; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
        .ticket-brand { font-size: 20px; font-weight: 700; letter-spacing: 1px; }
        .ticket-type { background: ${colors.accent}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px; }
        .ticket-body { display: flex; }
        .ticket-main { flex: 1; padding: 32px; }
        .ticket-event-name { font-size: 24px; font-weight: 700; color: #18181b; margin-bottom: 4px; }
        .ticket-subtitle { font-size: 14px; color: #71717a; margin-bottom: 20px; }
        .ticket-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .detail-label { font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .detail-value { font-size: 16px; font-weight: 600; color: #18181b; }
        .ticket-seat-info { display: flex; gap: 24px; padding: 16px; background: #f4f4f5; border-radius: 12px; margin-bottom: 20px; }
        .seat-block { text-align: center; }
        .seat-label { font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; }
        .seat-value { font-size: 28px; font-weight: 700; color: ${colors.accent}; }
        .ticket-qr { width: 220px; border-left: 2px dashed #e4e4e7; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; }
        .ticket-qr::before { content: ''; position: absolute; left: -10px; top: -10px; width: 20px; height: 20px; background: #f5f5f5; border-radius: 50%; }
        .ticket-qr::after { content: ''; position: absolute; left: -10px; bottom: -10px; width: 20px; height: 20px; background: #f5f5f5; border-radius: 50%; }
        .qr-label { font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 2px; margin-top: 12px; }
        .qr-id { font-size: 12px; font-weight: 600; color: #18181b; font-family: monospace; margin-top: 4px; }
        .ticket-footer { background: #f9fafb; border-top: 1px solid #e4e4e7; padding: 12px 32px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #a1a1aa; }
        .barcode { font-family: monospace; letter-spacing: 3px; font-size: 13px; color: #52525b; }
        @media print { body { padding: 0; background: white; } .no-print { display: none; } }
      </style></head><body>
      <div class="ticket">
        <div class="ticket-header">
          <div class="ticket-brand">EUROMATCHTICKETS</div>
          <div class="ticket-type">${typeInfo.label}</div>
        </div>
        <div class="ticket-body">
          <div class="ticket-main">
            <div class="ticket-event-name">${event?.title || "Event"}</div>
            <div class="ticket-subtitle">${event?.subtitle || ""}</div>
            <div class="ticket-details">
              <div><div class="detail-label">Date</div><div class="detail-value">${dateInfo.full}</div></div>
              <div><div class="detail-label">Time</div><div class="detail-value">${dateInfo.time}</div></div>
              <div><div class="detail-label">Venue</div><div class="detail-value">${event?.venue || "TBA"}</div></div>
              <div><div class="detail-label">City</div><div class="detail-value">${event?.city || ""}</div></div>
            </div>
            <div class="ticket-seat-info">
              <div class="seat-block"><div class="seat-label">Section</div><div class="seat-value">${ticket?.section || "GA"}</div></div>
              <div class="seat-block"><div class="seat-label">Row</div><div class="seat-value">${ticket?.row || "-"}</div></div>
              <div class="seat-block"><div class="seat-label">Seat</div><div class="seat-value">${ticket?.seat || "-"}</div></div>
              <div class="seat-block"><div class="seat-label">Category</div><div class="seat-value" style="font-size:16px;padding-top:6px">${(category || "").toUpperCase()}</div></div>
            </div>
          </div>
          <div class="ticket-qr">
            <div style="padding:8px;background:white;border-radius:8px;">
              ${ticketRef.current?.querySelector("svg.qr-svg")?.outerHTML || '<div style="width:140px;height:140px;background:#eee;border-radius:8px"></div>'}
            </div>
            <div class="qr-label">Scan to Enter</div>
            <div class="qr-id">${shortId}</div>
          </div>
        </div>
        <div class="ticket-footer">
          <div>EuroMatchTickets.com | Buyer protection</div>
          <div class="barcode">${orderId.replace(/-/g, " ").toUpperCase()}</div>
        </div>
      </div>
      <div class="no-print" style="text-align:center;margin-top:24px">
        <button onclick="window.print()" style="padding:12px 32px;background:#18181b;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer">Print Ticket</button>
      </div>
      </body></html>
    `);
    printWindow.document.close();
  }, [event, ticket, category, colors.accent, typeInfo.label, dateInfo, shortId, orderId]);

  return (
    <div ref={ticketRef} data-testid={`professional-ticket-${orderId}`} className="w-full">
      <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
        {/* Header Bar */}
        <div className="bg-[#1e1e1e] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-white" />
            <span className="text-white font-bold tracking-widest text-sm">EUROMATCHTICKETS</span>
          </div>
          <span className={`${colors.bg} text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full`}>
            {typeInfo.label}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row">
          {/* Main Info */}
          <div className="flex-1 p-6">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-1" data-testid="ticket-event-name">
              {event?.title || "Event"}
            </h2>
            {event?.subtitle && (
              <p className="text-slate-400 text-sm mb-4">{event.subtitle}</p>
            )}

            {/* Date & Venue */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Date</p>
                <p className="text-sm font-semibold text-zinc-800">{dateInfo.full}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Time</p>
                <p className="text-sm font-semibold text-zinc-800">{dateInfo.time}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Venue</p>
                <p className="text-sm font-semibold text-zinc-800">{event?.venue || "TBA"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">City</p>
                <p className="text-sm font-semibold text-zinc-800">{event?.city || ""}</p>
              </div>
            </div>

            {/* Seat Info Boxes */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Section", value: ticket?.section || "GA" },
                { label: "Row", value: ticket?.row || "-" },
                { label: "Seat", value: ticket?.seat || "-" },
                { label: "Category", value: (category || "STD").toUpperCase() },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-100 rounded-lg px-4 py-2 text-center min-w-[70px]">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className={`text-lg font-bold ${colors.text}`} style={{ color: colors.accent }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Section - Tear Line */}
          <div className="relative md:w-[200px] border-t md:border-t-0 md:border-l-2 md:border-dashed border-zinc-200">
            {/* Tear Circles */}
            <div className="hidden md:block absolute -left-[11px] -top-[11px] w-5 h-5 bg-[hsl(210,20%,98%)] rounded-full" />
            <div className="hidden md:block absolute -left-[11px] -bottom-[11px] w-5 h-5 bg-[hsl(210,20%,98%)] rounded-full" />
            
            <div className="flex flex-col items-center justify-center p-6 h-full">
              <div className="bg-[#1e1e1e] p-2 rounded-lg border border-zinc-200">
                <QRCodeSVG
                  value={qrData}
                  size={compact ? 100 : 130}
                  className="qr-svg"
                  level="M"
                />
              </div>
              <p className="text-[9px] text-slate-500 uppercase tracking-[3px] mt-3 font-semibold">Scan to Enter</p>
              <p className="text-xs font-mono font-bold text-zinc-700 mt-1">{shortId}</p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Shield className="w-3 h-3" />
            <span>Buyer protection | euromatchtickets.com</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 tracking-wider">
            {orderId.replace(/-/g, " ").toUpperCase().slice(0, 24)}
          </span>
        </div>
      </div>

      {/* Download Button */}
      {!compact && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-white/10 text-slate-600 hover:bg-slate-100"
            data-testid="download-ticket-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            Download / Print Ticket
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTicket;
