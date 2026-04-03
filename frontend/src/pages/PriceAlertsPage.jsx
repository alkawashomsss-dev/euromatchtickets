import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { useLanguage } from "../i18n/LanguageProvider";
import { 
  Bell, Trash2, Calendar, MapPin, TrendingDown, 
  Music, Trophy, AlertCircle, Check
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const PriceAlertsPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API}/price-alerts`, { withCredentials: true });
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`${API}/price-alerts/${alertId}`, { withCredentials: true });
      toast.success("Alert deleted");
      fetchAlerts();
    } catch (error) {
      toast.error("Failed to delete alert");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('alerts.title')}</h1>
            <p className="text-slate-500">Get notified when prices drop</p>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{t('alerts.noAlerts')}</h3>
            <p className="text-slate-500 mb-6">{t('alerts.createFirst')}</p>
            <Link to="/events">
              <Button className="btn-accent">Browse Events</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => {
              const event = alert.event;
              const isMatch = event?.event_type === "match";
              const priceReached = alert.current_lowest && alert.current_lowest <= alert.target_price;
              
              return (
                <div 
                  key={alert.alert_id}
                  className={`bg-white border rounded-2xl p-6 ${
                    priceReached 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : alert.status === 'triggered'
                      ? 'border-violet-200 opacity-60'
                      : 'border-slate-100'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Event Image */}
                    <div className="w-full md:w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={event?.event_image || (isMatch 
                          ? "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
                          : "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
                        )}
                        alt={event?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={isMatch ? "tag-match text-xs" : "tag-concert text-xs"}>
                          {isMatch ? <Trophy className="w-3 h-3 mr-1" /> : <Music className="w-3 h-3 mr-1" />}
                          {isMatch ? "Match" : "Concert"}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={alert.status === 'triggered' 
                            ? 'border-purple-500/50 text-violet-600' 
                            : priceReached 
                            ? 'border-emerald-500/50 text-emerald-600'
                            : 'border-slate-200 text-slate-500'
                          }
                        >
                          {alert.status === 'triggered' 
                            ? t('alerts.triggered')
                            : priceReached 
                            ? 'Price Reached!' 
                            : t('alerts.active')
                          }
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-bold">{event?.title}</h3>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event?.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{event?.venue}, {event?.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-slate-400">{t('alerts.targetPrice')}</div>
                        <div className="text-xl font-bold text-violet-600">€{alert.target_price}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-slate-400">{t('alerts.currentPrice')}</div>
                        <div className={`text-xl font-bold ${
                          priceReached ? 'text-emerald-600' : 'text-white'
                        }`}>
                          {alert.current_lowest ? `€${alert.current_lowest}` : 'N/A'}
                        </div>
                      </div>

                      {priceReached && (
                        <Link to={`/event/${event?.slug || event?.event_id}`}>
                          <Button className="btn-accent">
                            Buy Now
                          </Button>
                        </Link>
                      )}

                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAlert(alert.alert_id)}
                        className="text-red-600 hover:text-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlertsPage;
