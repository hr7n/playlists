// parse token from query params
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      localStorage.setItem('spotify-token', token);
      toast.success('Spotify login successful');
      navigate('/');
    } else {
      toast.error('Spotify login failed');
      navigate('/login');
    }
  }, [navigate]);

  return <div>Processing Spotify login...</div>;
};

export default SpotifyCallback;
