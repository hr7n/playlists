import React, { useEffect, useState } from 'react';
import './SpotifyPlayer.css';
import { getAccessToken } from '../../utils/spotify';

const SpotifyPlayer = ({ tracks = [], autoplay = false }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState(null);
  const [currentTrack, setCurrentTrack] = useState({
    albumImageUrl: '',
    title: 'Track Title',
    artist: 'Track Artist',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    const initializePlayer = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          setError('No Spotify access token found. Please log in to Spotify.');
          return;
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
          const spotifyPlayer = new window.Spotify.Player({
            name: 'Spotify Web Playback SDK',
            getOAuthToken: (cb) => {
              cb(token);
            },
          });

          spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            setPlayerReady(true);
          });

          spotifyPlayer.addListener('initialization_error', ({ message }) => {
            setError(`Failed to initialize: ${message}`);
          });

          spotifyPlayer.addListener('authentication_error', ({ message }) => {
            setError(`Failed to authenticate: ${message}`);
          });

          spotifyPlayer.addListener('account_error', ({ message }) => {
            setError(`Premium required: ${message}`);
          });

          spotifyPlayer.connect().then((success) => {
            if (success) {
              setPlayer(spotifyPlayer);
            }
          });
        };
      } catch (err) {
        setError('Failed to initialize Spotify player. Please try again.');
      }
    };

    initializePlayer();

    return () => {
      document.body.removeChild(script);
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  const play = async () => {
    if (!player || !deviceId) return;
    try {
      await player.resume();
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to play. Please try again.');
    }
  };

  const pause = async () => {
    if (!player) return;
    try {
      await player.pause();
      setIsPlaying(false);
    } catch (err) {
      setError('Failed to pause track.');
    }
  };

  const nextTrack = async () => {
    if (!player) return;
    try {
      await player.nextTrack();
    } catch (err) {
      setError('Failed to skip track.');
    }
  };

  const previousTrack = async () => {
    if (!player) return;
    try {
      await player.previousTrack();
    } catch (err) {
      setError('Failed to go back.');
    }
  };

  return (
    <div className="player-container">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="img-container">
            {currentTrack.albumImageUrl ? (
              <img src={currentTrack.albumImageUrl} alt="Album Art" />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
          </div>
          <div className="track-info">
            <h2 id="title">{currentTrack.title}</h2>
            <h3 id="artist">{currentTrack.artist}</h3>
          </div>
          <div className="spotify-controls">
            <button onClick={previousTrack} disabled={!playerReady}>
              Previous
            </button>
            {isPlaying ? (
              <button onClick={pause} disabled={!playerReady}>
                Pause
              </button>
            ) : (
              <button onClick={play} disabled={!playerReady}>
                Play
              </button>
            )}
            <button onClick={nextTrack} disabled={!playerReady}>
              Next
            </button>
          </div>
          {!playerReady && (
            <div className="status-message">Connecting to Spotify...</div>
          )}
        </>
      )}
    </div>
  );
};

export default SpotifyPlayer;
