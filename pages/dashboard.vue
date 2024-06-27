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
   <Spotify />
    <!-- User Info Forms -->
    <TabsWrapper>
    <Tab title="Settings">
    <div class="ml-10 mb-10">
      <h2 class="edit center">Display name</h2>
    <input v-model="displayname" type="text" placeholder="Set display name" class="input" />

    <h2 class="edit center">Username</h2>
    <input v-model="username" type="text" placeholder="Set username" class="input" />
    
    <h2 class="edit center">Game</h2>
    <input v-model="game" type="text" placeholder="Set game" class="input" />

    <h2 class="edit center">Bio</h2>
    <textarea v-model="bio" placeholder="Set bio" class="input bio-h"></textarea>

    <h2 class="edit center">Custom CSS</h2>
    <p>Warning! This is dangerous and potentially site breaking. Be careful what you input.</p>
    <textarea v-model="css" placeholder="Set CSS" class="input bio-h"></textarea>

    <h2 class="edit center">HypeRate</h2>
    <input v-model="hyperate" type="text" placeholder="HypeRate ID" class="input cursor-not-allowed" disabled/>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-10">HypeRate feature is currently scheduled under maintenance due to websocket flooding.</p>
    <br/>
    <!-- Custom Domain Form -->
    <form @submit.prevent="handleSubmit" disabled>
      <h2 class="edit center">Custom Domain</h2>
      <input v-model="customDomain" disabled type="text" class="input cursor-not-allowed" />
      <br />
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
    </div>
  </Tab>
  <Tab title="Stream">
    <Broadcast :call="call"/>
  </Tab>
  <Tab title="Connections">
            <button @click="handleSpotify" class="button green">
      <span v-if="spotifyToken">
        <Icon name="fa6-brands:spotify"/> Connected to Spotify
      </span>
      <span v-else>
        <Icon name="fa6-brands:spotify"/> Connect to Spotify
      </span>
    </button>
    </Tab>
  </TabsWrapper>
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
const css = ref('')
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
    if (error.response && error.response.status === 401) { // Token expired
      const newToken = await refreshSpotifyToken();
      if (newToken) {
        await fetchCurrentlyPlaying(); // Retry with new token
      }
    } else {
      console.error('Error fetching currently playing track:', error.message);
      currentlyPlaying.value = null;
    }
  }
};

const handleSpotify = () => {
  const clientId = 'f4c0d55175314b9a843c864e48b863a1';
  const redirectUri = window.location.origin + '/dashboard';
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
  }, 5000); // Polling interval in milliseconds (e.g., every 5 seconds)
};

onMounted(async () => {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
    if (data) {
      displayname.value = data.displayname
      username.value = data.username
      game.value = data.game
      bio.value = data.bio
      hyperate.value = data.hyperate
      avatarUrl.value = data.avatar_url
      pally.value = data.pally
      customDomain.value = data.custom_domain
      css.value = data.css
      spotifyToken.value = data.spotify

      // Fetch currently playing track initially
      await fetchCurrentlyPlaying();

      // Start polling for currently playing track
      startPollingCurrentlyPlaying();
    }
  } catch (error) {
    console.error('Error loading user data:', error.message);
  }
});

// Exchange authorization code for access and refresh tokens
const exchangeCodeForToken = async (code) => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: window.location.origin + '/dashboard',
        client_id: "f4c0d55175314b9a843c864e48b863a1",
        client_secret: "3f30cba020ed435ea8c0dae40069f93d"
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, 
    });
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token
    };
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};

const saveSpotifyTokens = async (accessToken, refreshToken) => {
  try {
    await supabase.from('profiles').update({ spotify: accessToken, spotify_refresh: refreshToken }).eq('id', user.value.id);
    spotifyToken.value = accessToken;
  } catch (error) {
    console.error('Error saving Spotify tokens:', error.message);
  }
};

const handleAuthorizationCallback = async () => {
  const code = router.currentRoute.value.query.code;
  if (code) {
    const tokens = await exchangeCodeForToken(code);
    if (tokens) {
      await saveSpotifyTokens(tokens.access_token, tokens.refresh_token);
    }
  }
};

const refreshSpotifyToken = async () => {
  try {
    const { data } = await supabase.from('profiles').select('spotify_refresh').eq('id', user.value.id).single();
    if (data && data.spotify_refresh) {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: data.spotify_refresh,
          client_id: "f4c0d55175314b9a843c864e48b863a1",
          client_secret: "3f30cba020ed435ea8c0dae40069f93d"
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }, 
      });
      const newAccessToken = response.data.access_token;
      await saveSpotifyTokens(newAccessToken, data.spotify_refresh);
      return newAccessToken;
    }
  } catch (error) {
    console.error('Error refreshing Spotify token:', error.message);
    return null;
  }
};

watch(router.currentRoute, handleAuthorizationCallback); // Watch for route changes and handle authorization callback

watch(displayname, (newValue) => updateField('displayname', newValue))
watch(username, (newValue) => updateField('username', newValue))
watch(game, (newValue) => updateField('game', newValue))
watch(bio, (newValue) => updateField('bio', newValue))
watch(css, (newValue) => updateField('css', newValue))
watch(pally, (newValue) => updateField('pally', newValue))
</script>
