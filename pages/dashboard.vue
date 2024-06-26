<template>
  <div class="min-h-screen center ">
    <!-- Profile Picture Upload -->
    <div class="flex items-center center uploadcard mb-5">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="avatar object-cover" />
          <svg v-else class="w-full h-full text-gray-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <p class="my-5 text-sm text-gray-500 dark:text-gray-400">
            <span class="text-blue-500 dark:text-blue-400">Upload</span> your profile picture
          </p>
        </div>
        <input id="dropzone-file" type="file" @change="updateAvatar" class="hidden" />
      </label>
    </div>
    <div v-if="currentlyPlaying" class="ml-10">
      <h2 class="edit center">Now Playing</h2>
      <div class="flex items-center mb-3">
        <img :src="currentlyPlaying.album.images[0].url" alt="Album Art" class="w-20 h-20 rounded-md mr-3">
        <div>
          <p class="font-semibold">{{ currentlyPlaying.name }}</p>
          <p class="text-sm text-gray-500">{{ currentlyPlaying.artists.map(artist => artist.name).join(', ') }}</p>
          <p class="text-sm text-gray-500">Album: {{ currentlyPlaying.album.name }}</p>
        </div>
      </div>
    </div>
    <!-- User Info Forms -->
    <div class="ml-10 mb-10">
      <h2 class="edit center">Display name</h2>
    <input v-model="displayname" type="text" placeholder="Set display name" class="input" />

    <h2 class="edit center">Username</h2>
    <input v-model="username" type="text" placeholder="Set username" class="input" />
    
    <h2 class="edit center">Game</h2>
    <input v-model="game" type="text" placeholder="Set game" class="input" />

    <Broadcast :call="call"/>

    <h2 class="edit center">Bio</h2>
    <textarea v-model="bio" placeholder="Set bio" class="input bio-h"></textarea>

    <h2 class="edit center">HypeRate</h2>
    <input v-model="hyperate" type="text" placeholder="HypeRate ID" class="input cursor-not-allowed" disabled/>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-10">HypeRate feature is currently scheduled under maintenance due to websocket flooding.</p>
    <br/>
    <!-- Custom Domain Form -->
    <form @submit.prevent="handleSubmit" disabled>
      <h2 class="edit center">Custom Domain</h2>
      <input v-model="customDomain" disabled type="text" class="input cursor-not-allowed" />
      <br />
      
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>

    <h2 class="edit center">Pally.gg</h2>
    <input v-model="pally" type="text" placeholder="Pally Username" class="input" />

    <!-- Other Components -->
    <EditSocialItem />
    <br />
    <nuxt-link :to="`/${username}`">
      <button class="button mb-5">View Profile</button>
    </nuxt-link>
    <br />

    <button @click="handleSpotify" class="button">Connect Spotify</button>
    <p>{{ spotifyToken }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import spotify from '~/plugins/spotify';
import axios from 'axios';

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const displayname = ref('')
const username = ref('')
const game = ref('')
const bio = ref('')
const hyperate = ref('')
const avatarUrl = ref('')
const pally = ref('')
const customDomain = ref('')
const error = ref('')
const lastNotificationTime = ref(0)
const spotifyToken = ref('')
const currentlyPlaying = ref(null); // To store currently playing track information

const router = useRouter(); // Get the router instance

// Function to fetch currently playing track from Spotify API
const fetchCurrentlyPlaying = async () => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${spotifyToken.value}`,
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

const handleSpotify = () => {
  const clientId = 'f4c0d55175314b9a843c864e48b863a1';
  const redirectUri = 'http://localhost:3000/dashboard';
  const scopes = 'user-read-private user-read-email user-read-currently-playing';
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = authUrl;
};

const handleSubmit = async () => {
  try {
    await supabase.from('profiles').update({ custom_domain: customDomain.value }).eq('id', user.value.id);
    const domain = { name: customDomain.value };

    await axios.post(
      `/v10/projects/${config.VERCEL_PROJECT_ID}/domains?teamId=team_A8VB8liqd3xy1xyKgQCizpMW`,
      domain,
      {
        headers: {
          Authorization: `Bearer ${config.VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (updateError) {
    error.value = updateError.message;
  }
};

const updateAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = user.value.id;
  const filePath = `public/avatars/${fileName}?updated`;

  try {
    const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file, {
      cacheControl: '1000',
      upsert: true,
    });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = await supabase.storage.from('uploads').getPublicUrl(filePath);
    if (error) throw error;

    avatarUrl.value = publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error.message);
  }
};

const updateField = async (field, value) => {
  try {
    await supabase.from('profiles').update({ [field]: value }).eq('id', user.value.id);
    if (Date.now() - lastNotificationTime.value > 5000) {
      lastNotificationTime.value = Date.now();
    }
  } catch (error) {
    console.error(`Error updating ${field}:`, error.message);
  }
};

const startPollingCurrentlyPlaying = () => {
  setInterval(async () => {
    await fetchCurrentlyPlaying();
    // You may want to add refreshSpotifyTokenIfNeeded() here if it's defined elsewhere
  }, 5000); // Polling interval in milliseconds (e.g., every 10 seconds)
};

onMounted(async () => {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
    if (data) {
      displayname.value = data.displayname
      username.value = data.username
      game.value = data.game
      bio.value = data.bio
      hyperate.value = data.heartbeat
      pally.value = data.pally
      customDomain.value = data.custom_domain
    }

    const { data: { publicUrl } } = await supabase.storage.from('uploads').getPublicUrl(`public/avatars/${user.value.id}?updated`)
    avatarUrl.value = publicUrl
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
  }

  try {
    const { data } = await supabase.from('profiles').select('spotify').eq('id', user.value.id).single()
    if (data) {
      spotifyToken.value = data.spotify
    }
  } catch (error) {
    console.error('Error fetching Spotify token:', error.message)
  }

  await handleAuthorizationCallback();
  await fetchCurrentlyPlaying();
  startPollingCurrentlyPlaying(); // Start polling for updates

})

const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: "http://localhost:3000/dashboard",
        client_id: "f4c0d55175314b9a843c864e48b863a1",
        client_secret: "3f30cba020ed435ea8c0dae40069f93d"
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};

const saveSpotifyToken = async (token) => {
  try {
    await supabase.from('profiles').update({ spotify: token }).eq('id', user.value.id);
    spotifyToken.value = token;
  } catch (error) {
    console.error('Error saving Spotify token:', error.message);
  }
};

const handleAuthorizationCallback = async () => {
  const code = router.currentRoute.value.query.code;
  if (code) {
    const token = await exchangeCodeForToken(code);
    if (token) {
      await saveSpotifyToken(token);
    }
  }
};  

watch(displayname, (newValue) => updateField('displayname', newValue))
watch(username, (newValue) => updateField('username', newValue))
watch(game, (newValue) => updateField('game', newValue))
watch(bio, (newValue) => updateField('bio', newValue))
watch(hyperate, (newValue) => updateField('heartbeat', newValue))
watch(pally, (newValue) => updateField('pally', newValue))
watch(customDomain, (newValue) => updateField('custom_domain', newValue))
</script>
