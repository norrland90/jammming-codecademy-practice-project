/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code with PKCE oAuth2 flow to authenticate
 * against the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

const clientId = '5c7d35ae3d6a4499b71aa6a7305d7143'; // your clientId
const redirectUrl = 'http://localhost:3000/'; // your redirect URL - must be localhost URL and/or HTTPS

const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const scope =
  'user-read-private user-read-email playlist-modify-public playlist-modify-private';

// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  get access_token() {
    return localStorage.getItem('access_token') || null;
  },
  get refresh_token() {
    return localStorage.getItem('refresh_token') || null;
  },
  get expires_in() {
    return localStorage.getItem('refresh_in') || null;
  },
  get expires() {
    return localStorage.getItem('expires') || null;
  },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem('expires', expiry);
  },
};

export async function onLoad() {
  // On page load, try to fetch auth code from current browser search URL
  let args = new URLSearchParams(window.location.search);
  let code = args.get('code');

  // If we find a code, we're in a callback, do a token exchange
  if (code) {
    const token = await getToken(code);
    currentToken.save(token);

    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete('code');

    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
  }

  // If we have a token, we're logged in, so fetch user data and render logged in template
  if (currentToken.access_token) {
    checkExpiredToken();
  }

  // Otherwise we're not logged in, so render the login template
  if (!currentToken.access_token) {
  }
}

onLoad();

// Check for need to refresh token on page load - if so, run refreshToken function.
// May need to run on all API calls.
async function checkExpiredToken() {
  const currentTimestamp = Date.now();
  const expireTimestamp = Date.parse(currentToken.expires);
  if (currentTimestamp > expireTimestamp) {
    const token = await refreshToken();
    currentToken.save(token);
  }
}

export async function redirectToSpotifyAuthorize() {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ''
  );

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  window.localStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

// Spotify API Calls
async function getToken(code) {
  const code_verifier = localStorage.getItem('code_verifier');

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
        code_verifier: code_verifier,
      }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function refreshToken() {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token,
    }),
  });

  return await response.json();
}

async function getUserData() {
  const response = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + currentToken.access_token },
  });

  return await response.json();
}

export async function getSearchResults(query) {
  const type = 'track';
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=${type}`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + currentToken.access_token },
    }
  );

  return await response.json();
}

export async function savePlaylist(name) {
  // Get user ID
  const data = await getUserData();
  const userId = data.id;

  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + currentToken.access_token },
      body: JSON.stringify({ name: name, public: false }),
    }
  );
  const playlistData = await response.json();
  const playlistId = playlistData.id;
  return [playlistId, userId];
}

export async function addItemsToPlaylist(userId, playlistId, arrayOfTracks) {
  const trackUris = createTrackUris(arrayOfTracks);
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + currentToken.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackUris),
    }
  );

  return await response.json();
}

function createTrackUris(arrayOfTracks) {
  const trackUris = {
    uris: arrayOfTracks.map((track) => {
      return `spotify:track:${track.id}`;
    }),
  };
  return trackUris;
}

// THIS WORKS TOO, BUT SEEMS TO BE THE IMPLICIT GRANT - NOT RECOMMENDED
// SHOULD TRY THE RECOMMENDED Authorization Code with PKCE Flow before continuing, because probably better than this.

// const clientId = '6fb630f8af574e34a9866379335a2bb7'; // Insert client ID here.
// const redirectUrl = 'http://localhost:3001/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.

// let accessToken;

// const Spotify = {
//   getAccessToken() {
//     if (accessToken) return accessToken;

//     const tokenInUrl = window.location.href.match(/access_token=([^&]*)/);
//     const expiresInUrl = window.location.href.match(/expires_in=([^&]*)/);

//     if (tokenInUrl && expiresInUrl) {
//       // if they exist, set the accesstoken and expiretime
//       accessToken = tokenInUrl[1];
//       const expiresIn = +expiresInUrl[1];

//       // set the access token to expire at expire time
//       setTimeout(() => {
//         accessToken = '';
//       }, expiresIn * 1000);

//       // Clear the parameters in url, allowing us to grab a new access token when it expires.
//       window.history.pushState('Access token', null, '/');

//       return accessToken;
//     } else {
//       // If token does not exist, redirect user to login page
//       const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
//       window.location = accessUrl;
//     }
//   },

//   search(searchTerm) {
//     const accessToken = Spotify.getAccessToken();
//     return fetch(
//       `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     )
//       .then((response) => {
//         console.log(response);
//         return response.json();
//       })
//       .then((data) => {
//         console.log(data);
//         if (!data.tracks) {
//           return [];
//         } else {
//           return data.tracks.items.map((track) => ({
//             id: track.id,
//             name: track.name,
//             artist: track.artists[0].name,
//             album: track.album.name,
//             uri: track.uri,
//           }));
//         }
//       });
//   },
// };

// export default Spotify;
