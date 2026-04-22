import { MapPin, Clock, Train, Car, Users, Info } from "lucide-react";

const VenueInfoSection = ({ event }) => {
  if (!event?.venue) return null;

  const venueQuery = encodeURIComponent(`${event.venue}, ${event.city}${event.country ? `, ${event.country}` : ''}`);
  const mapKey = process.env.REACT_APP_GOOGLE_MAPS_KEY || "";
  const mapUrl = mapKey ? `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${venueQuery}&zoom=14` : "";

  return (
    <div className="bg-[#1e1e1e] rounded-none border border-white/10 overflow-hidden shadow-sm" data-testid="venue-info">
      {/* Map */}
      <div className="h-48 md:h-56 bg-slate-100 relative">
        <iframe
          title={`${event.venue} location`}
          src={mapUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" /> {event.venue}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {event.city}{event.country ? `, ${event.country}` : ''}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Clock, label: "Doors Open", value: "2 hours before" },
            { icon: Car, label: "Parking", value: "Available" },
            { icon: Train, label: "Public Transit", value: "Nearby" },
            { icon: Users, label: "Capacity", value: event.capacity || "50,000+" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-[13px]">
              <item.icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-400">{item.label}</p>
                <p className="text-slate-300 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${venueQuery}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-[#15151e] hover:bg-slate-100 text-slate-300 text-sm font-medium rounded-none border border-white/10 transition-colors"
          data-testid="venue-directions-link"
        >
          <MapPin className="w-4 h-4" /> Get Directions
        </a>
      </div>
    </div>
  );
};

export default VenueInfoSection;
