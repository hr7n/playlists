// get and manage spotify access token

const getAccessToken = async () => {
  const token = localStorage.getItem('spotify-token');
  if (token) return token;

  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');

  if (accessToken) {
    localStorage.setItem('spotify-token', accessToken);
    return accessToken;
  }

  return null;
};

// initiate spotify login
export const spotifyLogin = () => {
  fetch(`http://localhost:3001/auth/spotify`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to initiate Spotify login.');
      }
    })
    .catch((error) => {
      console.error('Error during Spotify login:', error);
    });
};

// search for a song
export const songSearch = async (query) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('No access token found. Please log in with Spotify.');
  }
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to search for tracks');
  }
  const data = await response.json();
  return data.tracks.items;
};

// play a song
export const songPlay = async (songId, deviceId) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('No access token found. Please log in with Spotify.');
  }

  if (!deviceId) {
    throw new Error('No device ID provided.');
  }

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ uris: [`spotify:track:${songId}`] }),
    }
  );

  if (response.status === 204) {
    return true;
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};

export { getAccessToken };
