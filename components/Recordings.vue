<template>
  <div class="flex container flex-wrap">
    <div v-for="recording in recordings" class="w-1/3 px-2 py-2">
      <!-- Display each recording -->
      <video class="vod" :src="recording.url" controls></video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { Call, CallRecording } from '@stream-io/video-client'
import 'video.js/dist/video-js.css'


// Setup reactive references
const profiles = ref<{ username: string }[]>([])
const recordings = ref<{ recording: string }[]>([])
// Fetch recordings method
async function getRecordings() {
  if (!call) return
  try {
    const response = await call.queryRecordings()
    recordings.value = response?.recordings
  } catch (error) {
    console.error('Error fetching recordings:', error)
  }
}

// Fetch profiles method
async function getProfiles() {
  try {
    const response = await fetch('/api/profiles')
    if (response.ok) {
      profiles.value = await response.json()
    } else {
      console.error('Failed to fetch profiles:', response.status)
    }
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

// Fetch profiles and recordings on component mount
onMounted(async () => {
  await getProfiles()
  await getRecordings()
})
</script>

<style scoped>
video {
  object-fit: contain;
  width: 100%;
}

.button.streambutton {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.button.streambutton:hover {
  background-color: #0056b3;
}
</style>
