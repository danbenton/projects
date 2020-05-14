
let accessToken
const redirectURI = "http://jamming-spotify.s3-website-us-east-1.amazonaws.com"
const clientId = '6369b7dfc7a44e678aeac7cd544f1162'

const Spotify = {
  getAccessToken: function() {
    if (accessToken) {
      return accessToken
    } 
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
      const expiryMatch = window.location.href.match(/expires_in=([^&]*)/)

      if (accessTokenMatch && expiryMatch) {
        accessToken = accessTokenMatch[1]
        const expiry = Number(expiryMatch[1])

        window.setTimeout(() => accessToken = '', expiry * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken
      } else {
        const windowUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        window.location = windowUrl
      }
    },
  search(term) {
    const accessToken = Spotify.getAccessToken()
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
      })
      .then(response => {
        return response.json()
      })
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return []; 
        } 
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name, 
            uri: track.uri
          }
        })
      })
    },
  savePlaylist(playlist, uriArray) {
    if (!playlist || !uriArray.length) {
      return;
    }
    
    const accessToken = Spotify.getAccessToken()
    const headers = {Authorization: `Bearer ${accessToken}`}
    let userId

    return fetch("https://api.spotify.com/v1/me", {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
        { 
          headers: headers, 
          method:'POST',
          body: JSON.stringify({name: playlist})
          })
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistID = jsonResponse.id
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {    
            headers: headers, 
            method: "POST",
            body: JSON.stringify({uris: uriArray})
          })
        })
      }
    }

export default Spotify; 
