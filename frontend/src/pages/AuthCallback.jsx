import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, useAuth } from "../App";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          setError("No session ID found");
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        // Exchange session_id for session_token
        const response = await axios.post(`${API}/auth/session`, {
          session_id: sessionId
        }, { withCredentials: true });

        if (response.data.success) {
          // Save session token to localStorage for cross-origin requests
          if (response.data.session_token) {
            localStorage.setItem('session_token', response.data.session_token);
          }
          setUser(response.data.user);
          // Clear hash and redirect
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/', { replace: true });
        } else {
          throw new Error("Authentication failed");
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate('/'), 2000);
      }
    };

    processAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-400 mb-4">{error}</div>
            <p className="text-zinc-500">Redirecting...</p>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
