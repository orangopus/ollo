<template>
  <div>
    <section v-if="showRemoteVideo">
      <div class="flex profilescont relative center" style="text-align: -webkit-center;">
        <ClientOnly>
          <Video :call="call" :participant="remoteParticipant" />
          <Chat />
        </ClientOnly>
      </div>
      <div class="grid-card flex container profilescont center">
        <NuxtLink :to="`/${profile?.username}`">
          <div><img
          class="avatar avatarstream"
          :src="profile?.avatar"
          alt="Avatar"
        /></div>
        </NuxtLink>
        <div class="profileinfo !items-center !ml-7 streaminfo mb-3">
          <h1 class="username streamtitle">
          {{ profile?.displayname }}
          <span class="streamtitle handle">@{{ profile?.username }}</span>
        </h1>
        <p class="bio text-left">{{ profile?.bio }}</p>
      </div>
      <div class="streamgame" :style="{ backgroundImage: `url(${game?.background_image})` }">
        <NuxtLink :to="`https://rawg.io/games/${game.slug}`">
        <div class="streamgame2">
          <p class="gametitle">{{ game.name }}</p>
          <p class="gamebio">{{ game.description_raw }}</p>
        </div>
      </NuxtLink>
      </div>
    </div>
    </section>
    <section v-else>
      <div class="grid-card !mt-5 flex items-center container center p-5">
        <img
          class="avatar"
          :src="profile?.avatar"
          alt="Avatar"
        />
        <div class="!ml-5">
          <p class="username">{{ profile?.username }} is offline.</p>
          <p class="bio text-left">{{ profile?.bio }}</p>
        </div>
      </div>
    </section>
    <div class="grid grid-card container profilescont center !px-10 p-5">
        <MDC :value="profile?.html"/>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useStreamStore from '@/stores/getstream.client';
import { storeToRefs } from 'pinia';

// User authentication
const user = useSupabaseUser();
const routes = useRoute().params;
const router = useRouter();

const username = routes.username;

// Define profile and game as refs
const profile = ref(null);
const game = ref(null);

// Function to fetch profiles from an API
async function getProfiles() {
  try {
    const response = await $fetch('/api/profiles');
    console.log('Profiles fetched:', response);
    return response; // Assuming response is an array of profiles
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
}

// Computed property to derive gameTitle from profile
const gameTitle = computed(() => {
  return profile.value ? encodeURIComponent(profile.value.game) : '';
});

// Fetch game details based on gameTitle
async function fetchGames() {
  try {
    if (gameTitle.value) {
      const response = await $fetch(`https://api.rawg.io/api/games?key=95fc0cc0084543e9a2ea58e605e76829&search=${gameTitle.value}`, {
        method: 'GET'
      });
      if (response.results.length > 0) {
        const gameId = response.results[0].id;
        const gameDetails = await fetchGameDetails(gameId);
        game.value = gameDetails;
      }
    }

    if(gameTitle.value === "Development" || gameTitle.value === "dev") {
      game.value.name = "Development"
      game.value.description_raw = "Developing the things."
      game.value.slug = "development"
      game.value.background_image = "https://orangop.us/img/section-bg.png"
    }
  } catch (error) {
    console.error('Error fetching games list:', error);
  }
}

async function fetchGameDetails(gameId) {
  try {
    const response = await $fetch(`https://api.rawg.io/api/games/${gameId}?key=95fc0cc0084543e9a2ea58e605e76829`, {
      method: 'GET'
    });
    console.log('Game details fetched:', response);
    return response;
  } catch (error) {
    console.error('Error fetching game details:', error);
  }
}

// Lifecycle hook to fetch profiles and games on component mount
onMounted(async () => {
  const profiles = await getProfiles();
  profile.value = profiles.find(p => p.username === username);
  if (profile.value) {
    await fetchGames();
  }
});

// Using pinia store for managing stream state
const store = useStreamStore();
const { call, remoteParticipant } = storeToRefs(store);

const callId = ref(null);

// Watch for changes in profile value
watch(() => profile.value, (newProfile) => {
  if (newProfile) {
    callId.value = newProfile.username;
    watchStream();
  }
});

// Computed property to determine if remote video should be shown
const showRemoteVideo = computed(() => {
  return call.value && remoteParticipant.value;
});

// Function to watch stream based on callId
function watchStream() {
  if (callId.value) {
    console.log('Watching stream for:', callId.value);
    store.watchStream(callId.value);
  }
}
</script>
