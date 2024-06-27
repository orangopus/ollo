<template>
  <div>
    <client-only>
      <section v-if="isCallLive">
        <Video v-if="call && remoteParticipant" :call="call" :participant="remoteParticipant" />
      </section>
      <section v-else>
        <h1 class="edit">Start a broadcast</h1>
        <input type="text" class="input rtmp" :defaultValue="RTMP"/>

        <h1 class="edit">Stream Key</h1>
        <input type="text" class="input rtmp" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoib3JhbmdvcHVzIn0.Rt3FIvYcUMOdx6o-MUBCLZOdmn9lfXbTJ5Qg_yvRQ_0"/>
      </section>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useStreamStore from '@/stores/getstream.client'
import type { Call, StreamVideoParticipant } from '@stream-io/video-client'

const store = useStreamStore()
const { call, remoteParticipant } = storeToRefs(store)
const user = useSupabaseUser()

const profiles = await getProfiles()

const profile = user.value ? profiles.find((profile) => profile.id === user.value.id) : null

const props = defineProps<{
  call: Call | undefined 
  participant: StreamVideoParticipant | undefined
}>()

const getStreamApiKey = 'qxhh2h2czs7x'; // Add your GetStream API key here

const RTMP = `rtmps://video-ingress-ohio-vi1.stream-io-video.com:443/qxhh2h2czs7x.livestream.${profile.username}`


const callId = ref<string | null>(null)

// Fetch profiles and set the callId if a matching profile is found
async function fetchProfilesAndSetCallId() {
  try {
    const profiles = await getProfiles()
    const profile = profiles.find((profile) => profile.username === callId.value)
    callId.value = profile?.username || null;
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

async function getProfiles() {
  return await $fetch('/api/profiles')
}

const isCallLive = computed(() => {
  return !!(call.value && remoteParticipant.value)
})

function startBroadcast() {
  if (callId.value) {
    store.createCall(callId.value)
  }
}

// Fetch profiles when the component mounts

onMounted(() => {
  fetchProfilesAndSetCallId()
  });
</script>

<style scoped>
/* Add your styles here */
.input {
  /* Example style */
  padding: 10px;
  border: 1px solid #ccc;
}

.button {
  /* Example style */
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
