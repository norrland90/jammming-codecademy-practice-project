const clientId = ''; // Insert client ID here.
const redirectUrl = 'http://localhost:3001/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const tokenInUrl = window.location.href.match(/access_token=([^&]*)/);
    const expiresInUrl = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenInUrl && expiresInUrl) {
      // if they exist, set the accesstoken and expiretime
      accessToken = tokenInUrl[1];
      const expiresIn = +expiresInUrl[1];

      // set the access token to expire at expire time
      setTimeout(() => {
        accessToken = '';
      }, expiresIn * 1000);

      // Clear the parameters in url, allowing us to grab a new access token when it expires.
      window.history.pushState('Access token', null, '/');

      return accessToken;
    } else {
      // If token does not exist, redirect user to login page
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      window.location = accessUrl;
    }
  },

  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (!data.tracks) {
          return [];
        } else {
          return data.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          }));
        }
      });
  },
};

const testFunc = async (query) => {
  const token = Spotify.getAccessToken();

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

testFunc('hello');

export default Spotify;
