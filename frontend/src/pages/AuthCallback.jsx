import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const exchangeSession = async (sessionId, attempt = 1) => {
    try {
      const response = await axios.post(`${API}/auth/session`, {
        session_id: sessionId
      }, {
        withCredentials: true,
        timeout: 30000
      });

      if (response.data.success) {
        if (response.data.session_token) {
          localStorage.setItem('session_token', response.data.session_token);
        }
        setUser(response.data.user);
        window.history.replaceState(null, '', window.location.pathname);
        navigate('/', { replace: true });
        return true;
      }
      throw new Error("Authentication response invalid");
    } catch (err) {
      const detail = err?.response?.data?.detail || err.message;
      const status = err?.response?.status;

      // Retry on network/timeout/server errors (not on 401 auth errors)
      if (attempt < 3 && (!status || status >= 500 || err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK')) {
        setIsRetrying(true);
        setRetryCount(attempt);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        return exchangeSession(sessionId, attempt + 1);
      }

      setIsRetrying(false);
      if (detail === "Invalid session" || detail === "Invalid auth data") {
        setError("Session expired. Please go back and try logging in again.");
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        setError("Server is starting up. Please wait a moment and try again.");
      } else {
        setError(`Authentication error: ${detail || 'Unknown error'} (Status: ${status || 'N/A'})`);
      }
      return false;
    }
  };

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get('session_id');

      if (!sessionId) {
        setError("No session ID found in the URL. Please try logging in again.");
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      const success = await exchangeSession(sessionId);
      if (!success) {
        // Don't auto-redirect on error, let user retry manually
      }
    };

    processAuth();
  }, [navigate, setUser]);

  const handleRetry = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const sessionId = params.get('session_id');
    if (sessionId) {
      setError(null);
      setIsRetrying(true);
      exchangeSession(sessionId);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md" data-testid="auth-callback">
        {error ? (
          <div data-testid="auth-error">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <div className="text-red-400 mb-4 text-sm">{error}</div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="border-zinc-700 text-zinc-300"
                data-testid="auth-retry-btn"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-zinc-700 text-zinc-300"
                data-testid="auth-home-btn"
              >
                Go Home
              </Button>
            </div>
          </div>
        ) : (
          <div data-testid="auth-loading">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">
              {isRetrying ? `Reconnecting... (Attempt ${retryCount + 1}/3)` : "Signing you in..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
