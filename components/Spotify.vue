<template>
  <div class="spotify-component">
    <!-- Display currently playing track -->
    <div v-if="currentlyPlaying">
      <div class="track-info">
        <div class="album-cover-container">
          <img :src="currentlyPlaying.album.images[0].url" alt="Album Cover" class="album-cover">
          <img :src="currentlyPlaying.album.images[0].url" alt="Album Cover" class="album-coverimg">
        </div>
        <div class="track-details">
          <p class="bold">{{ currentlyPlaying.name }}</p>
          <p>{{ currentlyPlaying.artists.map(artist => artist.name).join(', ') }}</p>
          <p>Album: {{ currentlyPlaying.album.name }}</p>
          <div class="seek-bar">
        <div class="slider-container">
          <input 
            type="range" 
            min="0" 
            :max="currentTrackDuration" 
            v-model="currentPosition" 
            @input="onSeek" 
            class="spotify-slider" 
            :style="{
              '--seek-before-width': (currentPosition / currentTrackDuration * 100) + '%'
            }"
          />
        </div>
      </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Make sure axios is installed (`npm install axios`)


const username = useRoute().params.profile || useRoute().params.username;

// Assuming you have a way to get the user's profile

const user = useSupabaseUser();

const profiles = await getProfiles();

const profile = profiles.find((profile) => profile.username === username);

async function getProfiles() {
  return await $fetch('/api/profiles');
}

// Fetch currently playing track from Spotify API
const spotifyToken = ref(null);
const refreshToken = ref(null); // Store the refresh token
const currentlyPlaying = ref(null);
const currentTrackDuration = ref(0);
const currentPosition = ref(0);

// Function to fetch the currently playing track
const fetchCurrentlyPlaying = async () => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${spotifyToken.value}`,
      },
    });
    if (response.data && response.data.item) {
      currentlyPlaying.value = response.data.item;
      currentTrackDuration.value = response.data.item.duration_ms / 1000; // Convert to seconds
      currentPosition.value = response.data.progress_ms / 1000; // Convert to seconds
    } else {
      currentlyPlaying.value = null;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) { // Token expired
      await refreshSpotifyToken();
      await fetchCurrentlyPlaying();
    } else {
      console.error('Error fetching currently playing track:', error.message);
    }
  }
};

// Function to refresh the Spotify token
const refreshSpotifyToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken.value);
    params.append('client_id', 'your-client-id'); // Replace with your Spotify client ID
    params.append('client_secret', 'your-client-secret'); // Replace with your Spotify client secret

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    spotifyToken.value = response.data.access_token;
    if (response.data.refresh_token) {
      refreshToken.value = response.data.refresh_token;
    }
  } catch (error) {
    console.error('Error refreshing Spotify token:', error.message);
  }
};

// Function to seek the track
const onSeek = async (event) => {
  const newPosition = event.target.value * 1000; // Convert to milliseconds
  try {
    await axios.put(`https://api.spotify.com/v1/me/player/seek?position_ms=${newPosition}`, {}, {
      headers: {
        Authorization: `Bearer ${spotifyToken.value}`,
      },
    });
  } catch (error) {
    console.error('Error seeking track:', error.message);
  }
};

// Start polling for the currently playing track
const startPollingCurrentlyPlaying = () => {
  setInterval(fetchCurrentlyPlaying, 1000); // Poll every 1 second
};

// Load the initial data
onMounted(async () => {
  // Assume you have a way to get the initial access token and refresh token
  spotifyToken.value = profile.spotify; // Replace with actual token
  refreshToken.value = profile.spotify_refresh; // Replace with actual token

  await fetchCurrentlyPlaying();
  startPollingCurrentlyPlaying();
});
</script>

<style scoped>
.spotify-component {
  max-width: 600px;
  padding: 20px;
  border-radius: 5px;
}

.track-info {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border-radius: 25px;
  background-color: rgba(0,0,0);
  background-image: url(https://orangop.us/img/section-bg.png);
}

.track-details {
  margin-left: 170px;
  width: 100%;
}

.album-cover {
  filter: blur(10px);
  width: 140px;
  height: 140px !important;
  margin-right: 20px;
  border-radius: 20px;
  position: absolute;
}
.album-cover-container {
  display: contents;
}

.album-coverimg {
  width: 140px;
  height: 140px !important;
  margin-right: 20px;
  border-radius: 20px;
  position: absolute;
}

.seek-bar {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.slider-container {
  position: relative;
  width: 100%;
}

.spotify-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: transparent;
  border-radius: 2.5px;
  outline: none;
  position: relative;
  padding: 0;
  margin: 0;
  margin-top: 20px !important;
}

.spotify-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1db954;
  cursor: pointer;
  position: relative;
  z-index: 2;
  display: none;
}

.spotify-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #1db954;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.spotify-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  background: #4b4b4b; 
  border-radius: 2.5px;
  position: relative;
}

.spotify-slider::-moz-range-track {
  width: 100%;
  height: 5px;
  background: #4b4b4b;
  border-radius: 2.5px;
  position: relative;
}

.spotify-slider::before {
  content: '';
  height: 5px;
  background: #1db954;
  border-radius: 20px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: var(--seek-before-width);
}

.spotify-slider:hover {
  opacity: 1;
}
</style>
