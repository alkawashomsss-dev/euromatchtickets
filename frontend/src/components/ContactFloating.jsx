import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

const ContactFloating = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2" data-testid="contact-floating">
      {open && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <a
            href="tel:+498920174141"
            data-testid="floating-phone"
            className="flex items-center gap-2 bg-[#e10600] text-white pl-4 pr-3 py-2.5 shadow-lg hover:bg-[#b80500] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-xs font-bold whitespace-nowrap">+49 89 20174141</span>
          </a>
          <a
            href="https://wa.me/498920174141?text=Hi%20EuroMatchTickets%2C%20I%20need%20help%20with%20tickets"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="floating-whatsapp"
            className="flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-3 py-2.5 shadow-lg hover:bg-[#1ea952] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-bold">WhatsApp</span>
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        data-testid="floating-contact-toggle"
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 ${
          open ? "bg-[#15151e] border border-white/20 rotate-0" : "bg-[#25D366] hover:bg-[#1ea952]"
        }`}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default ContactFloating;
