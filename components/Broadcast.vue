<template>
  <div>
    <client-only>
      <section v-if="isCallLive">
        <Video v-if="call && localParticipant" :call="call" :participant="localParticipant" />
      </section>
      <section v-else>
        <input type="text" class="input" v-model="callId" placeholder="Enter a username" />
        <button @click="startBroadcast" class="button red">Start Broadcast</button>
      </section>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useStreamStore from '@/stores/getstream.client'

const store = useStreamStore()
const { call, localParticipant } = storeToRefs(store)

const callId = ref<string | null>(null)

// Fetch profiles and set the callId if a matching profile is found
async function fetchProfilesAndSetCallId() {
  try {
    const profiles = await getProfiles()
    const profile = profiles.find((profile) => profile.username === callId.value)
    callId.value = profile?.username || null
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

async function getProfiles() {
  return await $fetch('/api/profiles')
}

const isCallLive = computed(() => {
  return !!(call.value && localParticipant.value)
})

function startBroadcast() {
  if (callId.value) {
    store.createCall(callId.value)
  }
}

// Fetch profiles when the component mounts
onMounted(fetchProfilesAndSetCallId)
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
