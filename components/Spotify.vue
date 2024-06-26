<template>
  <div class="spotify-component">
    <!-- Display currently playing track -->
    <div v-if="currentlyPlaying">
      <div class="track-info">
        <img :src="currentlyPlaying.album.images[0].url" alt="Album Cover" class="album-cover">
        <div class="track-details">
          <p class="bold">{{ currentlyPlaying.name }}</p>
          <p>{{ currentlyPlaying.artists.map(artist => artist.name).join(', ') }}</p>
          <p>Album: {{ currentlyPlaying.album.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Make sure axios is installed (`npm install axios`)

const spotifyToken = ref(''); // Assuming you have a way to get Spotify access token

const username = useRoute().params.profile || useRoute().params.username;

const profiles = await getProfiles()

const profile = profiles.find((profile) => profile.username === username)

const currentlyPlaying = ref(null);

async function getProfiles(){
  return await $fetch('/api/profiles')
}

// Fetch currently playing track from Spotify API
const fetchCurrentlyPlaying = async () => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${profile.spotify}`,
      },
    });
    if (response.data.item) {
      currentlyPlaying.value = response.data.item;
    } else {
      currentlyPlaying.value = null;
    }
  } catch (error) {
    console.error('Error fetching currently playing track:', error.message);
    currentlyPlaying.value = null;
  }
};

const startPollingCurrentlyPlaying = () => {
  setInterval(async () => {
    await fetchCurrentlyPlaying();
    // You may want to add refreshSpotifyTokenIfNeeded() here if it's defined elsewhere
  }, 5000); // Polling interval in milliseconds (e.g., every 10 seconds)
};

onMounted(async () => {
  await fetchCurrentlyPlaying();
  startPollingCurrentlyPlaying(); // Start polling for updates
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
  background-color: rgb(0,0,0);
  background-image: url(https://orangop.us/img/section-bg.png);
}

.album-cover {
  width: 100px;
  height: 100px !important;
  margin-right: 20px;
  border-radius: 20px;
}
</style>
