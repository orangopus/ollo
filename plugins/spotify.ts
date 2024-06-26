// plugins/spotify-api.js

export default function (ctx, inject) {
    const clientID = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  
    const basic = Buffer.from(`${clientID}:${clientSecret}`).toString('base64')
    const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
  
    // Function to get access token from Spotify using refresh token
    const getAccessToken = async () => {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`
      })
      return response.json()
    }
  
    // Function to get the current now playing track using access token
    const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
    const getNowPlaying = async () => {
      const { access_token: accessToken } = await getAccessToken()
      return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  
    // Inject functions into Vue instances (ctx.app) or context (ctx.$spotify)
    inject('spotify', {
      getNowPlaying
    })
  }
  