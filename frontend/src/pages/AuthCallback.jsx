import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '../services/supabaseApi';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse hash fragment from URL (Supabase returns tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (!accessToken) {
          throw new Error('No access token found in URL');
        }

        // Verify token and get user from backend
        const res = await handleAuthCallback(accessToken);
        
        // Store token
        localStorage.setItem('supabase_token', accessToken);
        
        // Update auth context
        loginUser(res.data.user, accessToken);

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Callback error:', err);
        setError(err.response?.data?.error || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, loginUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <div className="text-red-500 text-xl mb-4">❌ {error}</div>
          <p className="text-text-secondary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-xl mb-2">Completing sign in...</p>
        <p className="text-text-secondary">Please wait</p>
      </div>
    </div>
  );
}
