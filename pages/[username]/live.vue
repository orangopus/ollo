<template>
  <div>
    <section v-if="showRemoteVideo">
      <div class="grid grid-card container profilescont center p-5">
        <ClientOnly>
          <Video :call="call" :participant="remoteParticipant" />
        </ClientOnly>
      </div>
      <div class="grid-card flex container profilescont p-5">
        <div><img
          class="avatar"
          :src="profile?.avatar"
          alt="Avatar"
        /></div>
        <div class="profileinfo !items-center !ml-5 mt-3">
          <h1 class="username">
          {{ twitch?.display_name || profile?.displayname }}
          <span class="handle">@{{ twitch?.login || profile?.username }}</span>
        </h1>
        <p class="bio text-left">{{ twitch?.description || profile?.bio }}</p>
      </div>
    </div>
    </section>
    <section v-else>
      <div class="grid-card mt-5 flex items-center container center p-5">
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
    <div class="grid grid-card container profilescont center p-5">
        <MDC :value="profile?.html"/>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useStreamStore from '@/stores/getstream.client';
import { storeToRefs } from 'pinia';

const user = useSupabaseUser();
const routes = useRoute().params;
const router = useRouter();

const username = routes.username;

const profiles = ref([]);
const profile = ref(null);

async function getProfiles() {
  try {
    profiles.value = await $fetch('/api/profiles');
    profile.value = profiles.value.find((profile) => profile.username === username) || null;
    if (!profile.value) {
      router.push({ name: 'error', params: { code: 404, message: 'User not found' } });
    }
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    router.push({ name: 'error', params: { code: 500, message: 'Internal Server Error' } });
  }
}

onMounted(() => {
  getProfiles();
});

const store = useStreamStore();
const { call, remoteParticipant } = storeToRefs(store);

const callId = ref(null);

watch(
  () => profile.value,
  (newProfile) => {
    if (newProfile) {
      callId.value = newProfile.username;
      watchStream();
    }
  }
);

const showRemoteVideo = computed(() => {
  return call.value && remoteParticipant.value;
});

function watchStream() {
  if (callId.value) {
    store.watchStream(callId.value);
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
