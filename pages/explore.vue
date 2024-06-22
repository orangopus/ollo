<template>
  <div class="explore place-content-center">
    <div class="profilescont text-left">
      <h1 class="text-3xl font-bold">
        Explore
        <span class="verified">{{ searchResults.filter(n => n.username).length }}</span>
      </h1>
      <input
        class="cards search mt-10"
        placeholder="Search for an ollo..."
        v-model="searchTerm"
        @input="handleChange"
      />
    </div>
    <div class="grid profilescont grid-cols-8 gap-5 paddinghero">
      <div
        v-for="profile in filteredSortedProfiles"
        :key="profile.id"
        class="grid col-span-2 auto-rows-max"
      >
        <div class="cards center paddingnone justify-center items-center overflow-hidden md:max-w-sm rounded-lg shadow-sm mx-auto">
          <nuxt-link :to="`/${profile?.username}`" class="none">
            <div class="grid-card dark p-5">
              <div class="center avatarcont">
                <img class="avatar" :src="profile.avatar ? profile.avatar : 'avatar.png'" />
              </div>
              <div class="info mt-4 center">
                <h1 class="username center">{{ profile.username }}</h1>
                <div>
                  <span class="handle">{{ profile.handle }}</span>
                </div>
                <div v-if="profile.isLive" class="live-status">Live</div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="mb-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
const supabase = useSupabaseClient();

const searchTerm = ref('');
const profiles = ref([]);
const searchResults = ref([]);
const getStreamApiKey = 'qxhh2h2czs7x'; // Add your GetStream API key here

const handleChange = () => {
  if (profiles.value) {
    searchResults.value = profiles.value.filter(
      profile =>
        profile.username !== null &&
        profile.username.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
};

const fetchProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    throw new Error(error.message);
  }
  profiles.value = data;
  searchResults.value = data;
  await updateLiveStatus();
};

const updateLiveStatus = async () => {
  const profileQueue = [...profiles.value];
  const batchSize = 10; // Number of profiles to process per interval

  const processBatch = async () => {
    if (profileQueue.length === 0) return;
    const currentBatch = profileQueue.splice(0, batchSize);
    await Promise.all(currentBatch.map(async (profile) => {
      profile.isLive = await checkIfLive(profile.username); // Use appropriate field for call ID
    }));
    setTimeout(processBatch, 5000); // Schedule next batch after 2 seconds
  };

  processBatch(); // Start processing the first batch
};

const checkIfLive = async (callId, retryCount = 0) => {
  const maxRetries = 5;
  const baseDelay = 2000; // 2 seconds

  try {
    const response = await fetch(`https://video.stream-io-api.com/api/v2/video/call/livestream/${callId}?api_key=${getStreamApiKey}`, {
      headers: {
        'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoib3JhbmdvcHVzIn0.Rt3FIvYcUMOdx6o-MUBCLZOdmn9lfXbTJ5Qg_yvRQ_0",
        'stream-auth-type': 'jwt',
      }
    });
    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    const data = await response.json();
    return data.live;
  } catch (error) {
    console.error('Error fetching live status:', error);
    if (error.message === 'Rate limit exceeded' && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      console.log(`Retrying in ${delay} ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return checkIfLive(callId, retryCount + 1);
    }
    return false;
  }
};

onMounted(() => {
  fetchProfiles();
});

const filteredSortedProfiles = computed(() => {
  return searchResults.value
    .filter(n => n.username)
    .sort((a, b) => a.username.localeCompare(b.username));
});
</script>
