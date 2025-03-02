import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PLAYLIST } from '../../utils/query';
import { FaPlay, FaPause } from 'react-icons/fa';

import './singularPlaylist.css';

const SingularPlaylistEl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  // const songs = [
  //   "Good Song",
  //   "Better Song",
  //   "Best Song",
  //   "Worst Song",
  //   "Bad Song",
  // ];

  // const playlists = [
  //   "Playlist 1",
  //   "Playlist 2",
  //   "Playlist 3",
  //   "Playlist 4",
  //   "Playlist 5",
  // ];

  const { data } = useQuery(GET_PLAYLIST);
  console.log('DATA', data);
  let playlists;
  if (data) {
    playlists = data?.getPlaylists;
    console.log('PLAYLISTS', playlists);
  }

  const handlePlayClick = async (e, playlist) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setCurrentPlaylistId(playlist._id);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing playlist:', error);
      setIsPlaying(false);
    }
  };
  // const { data: userData } = useQuery(GET_USER_EMAIL);
  // let userEmail;
  // if (userData) {
  //   userEmail = userData?.user?.email;
  //   console.log(userEmail);
  // }

  return (
    <>
      <div className="button-box">
        <Link to="/makeplaylist" style={{ 'text-decoration': 'none' }}>
          <button className="button">Make Playlist</button>
        </Link>
      </div>
      <h1 className="playlist-feed">Playlist Feed</h1>
      {playlists &&
        playlists.map((playlist, index) => (
          <>
            <Link
              to={'./playlist/' + playlist._id}
              style={{ 'text-decoration': 'none', width: '50%' }}
            >
              <div key={index} className="playlist-details">
                {/* <img src={song.artworkUrl} alt={song.name} /> */}
                <img
                  className="playlist-art"
                  src={playlist.songs[0].img}
                  alt="song-art"
                />
                <div className="playlist-info">
                  <h4 className="playlist-title">{playlist.name}</h4>
                  <p className="user">
                    {playlist.user.email
                      ? playlist.user.email.split('@')[0]
                      : 'Unable to fetch username'}
                  </p>
                </div>
              </div>
            </Link>
            <button
              className="play-button"
              onClick={(e) => handlePlayClick(e, playlist)}
            >
              {currentPlaylistId === playlist._id && isPlaying ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
            </button>
          </>
        ))}
    </>
  );
};

export default SingularPlaylistEl;
