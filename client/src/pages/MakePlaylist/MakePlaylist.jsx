import { useState, useEffect } from "react";
import AddedSong from "../../components/AddedSong/AddedSong";
import Navbar from "../../components/Navbar/Navbar";
import "./MakePlaylist.css";

const MakePlaylist = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songList, setSongList] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    if (searchQuery === "") {
      setSongList([]);
    } else {
      // Make a search request to Spotify API when the search query changes
      const clientId = "f4f10d8cdc4c43cfb9696c430ba1cb5a";
      const clientSecret = "72ab0302629e417cb4ca0c834c4479e3";
      const baseUrl = "https://api.spotify.com/v1/";

      const getAccessToken = async (clientId, clientSecret) => {
        const tokenUrl = "https://accounts.spotify.com/api/token";
        const data = new URLSearchParams();
        data.append("grant_type", "client_credentials");

        const auth = btoa(`${clientId}:${clientSecret}`);
        const headers = {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        };

        const response = await fetch(tokenUrl, {
          method: "POST",
          headers,
          body: data,
        });
        const tokenData = await response.json();
        return tokenData.access_token;
      };

      getAccessToken(clientId, clientSecret).then((accessToken) => {
        const type = "track";
        const limit = 10; // Number of results to display

        const endpoint = `search?q=${encodeURIComponent(
          searchQuery
        )}&type=${type}&limit=${limit}`;
        const url = baseUrl + endpoint;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        fetch(url, { headers })
          .then((response) => response.json())
          .then((searchResults) => {
            setSongList(searchResults.tracks.items);
          })
          .catch((error) => {
            console.error("Error fetching data from Spotify:", error);
          });
      });
    }
  }, [searchQuery]);

  const handleSongClick = (song) => {
    // Check if the song is not already in selectedSongs and the playlist has fewer than 5 songs
    console.log(song);
    if (
      !selectedSongs.some((selected) => selected.id === song.id) &&
      selectedSongs.length < 5
    ) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleRemoveSong = (song) => {
    const updatedSongs = selectedSongs.filter(
      (selected) => selected.id !== song.id
    );
    setSelectedSongs(updatedSongs);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreatePlaylistWithSong = (e) => {
    e.preventDefault();
    console.log("HELLO WORLD");
  };

  const handleChange = (e) => {
    setPlaylistName(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <form
        onSubmit={handleCreatePlaylistWithSong}
        className="make-playlist-container"
      >
        <div className="search-container">
          <div>
            <h2>Create Playlist</h2>
            <label htmlFor="playlistName">Playlist Name:</label>
            <input
              type="text"
              placeholder="Name"
              id="playlistName"
              value={playlistName}
              onChange={handleChange}
            />
          </div>

          <h2>Search for Songs</h2>
          <input
            type="text"
            placeholder="Search for a song..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />

          <ul className="search-list-container">
            {songList.map((song) => (
              <li key={song.id}>
                <button onClick={() => handleSongClick(song)}>
                  {song.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <h2>Selected Songs</h2>
        <ul>
          {selectedSongs.map((song) => (
            <AddedSong
              key={song.id}
              song={song}
              onRemove={() => handleRemoveSong(song)}
            />
          ))}
        </ul>
        <button className="btn" style={{ cursor: "pointer" }} type="submit">
          Submit Playlist Name with Desired Songs
        </button>
      </form>
    </div>
  );
};

export default MakePlaylist;
