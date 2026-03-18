import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const processGoogleAuth = async (code, attempt = 1) => {
    const redirectUri = window.location.origin + '/auth/callback';
    try {
      const response = await axios.post(`${API}/auth/google`, {
        code,
        redirect_uri: redirectUri
      }, { withCredentials: true, timeout: 30000 });

      if (response.data.success) {
        if (response.data.session_token) {
          localStorage.setItem('session_token', response.data.session_token);
        }
        setUser(response.data.user);
        const redirectTo = sessionStorage.getItem('auth_redirect_url') || '/';
        sessionStorage.removeItem('auth_redirect_url');
        navigate(redirectTo, { replace: true });
        return true;
      }
      throw new Error("Authentication response invalid");
    } catch (err) {
      const status = err?.response?.status;
      if (attempt < 3 && (!status || status >= 500 || err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK')) {
        setIsRetrying(true);
        setRetryCount(attempt);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        return processGoogleAuth(code, attempt + 1);
      }
      setIsRetrying(false);
      const detail = err?.response?.data?.detail || err.message;
      setError(detail || "Authentication failed");
      return false;
    }
  };

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const code = searchParams.get('code');
    if (code) {
      processGoogleAuth(code);
    } else {
      setError("No authorization code found. Please try logging in again.");
    }
  }, [navigate, setUser, searchParams]);

  const handleRetry = () => {
    const redirectUri = window.location.origin + '/auth/callback';
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const scope = encodeURIComponent('openid email profile');
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,98%)] flex items-center justify-center px-4">
      <div className="text-center max-w-md" data-testid="auth-callback">
        {error ? (
          <div data-testid="auth-error">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <div className="text-red-600 mb-4 text-sm">{error}</div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} variant="outline" className="border-slate-200 text-slate-600" data-testid="auth-retry-btn">
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="border-slate-200 text-slate-600" data-testid="auth-home-btn">
                Go Home
              </Button>
            </div>
          </div>
        ) : (
          <div data-testid="auth-loading">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-500">
              {isRetrying ? `Reconnecting... (Attempt ${retryCount + 1}/3)` : "Signing you in..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
