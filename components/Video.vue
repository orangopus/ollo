<template>
  <div id="video_box">
    <div v-if="props.call?.id && !isSpecificPage">
      <div id="video_overlays" class="text-center rounded-xl">
        <NuxtLink :to="`/${props.call.id}/live`">
          <button class="streambutton button">Watch Stream</button>
        </NuxtLink>
      </div>
    </div>
    <div>
      <video ref="videoElement" width="100%" class="rounded-xl" controls></video>
      <audio ref="audioElement"></audio>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Call, StreamVideoParticipant } from '@stream-io/video-client'

const props = defineProps<{
  call: Call | undefined 
  participant: StreamVideoParticipant | undefined
}>()

const route = useRoute()

const callId = ref<string | null>(props.call?.id || null)

const profiles = await getProfiles()

const profile = profiles.find((profile) => profile.username === callId.value)

// Define the specific page path where the button should be rendered
const specificPagePath =  `/${profile.username}/live`// Change this to your specific page path

const isSpecificPage = computed(() => {
  return route.path === specificPagePath
})

const videoElement = ref<HTMLVideoElement | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)
const unbindVideoElement = ref<(() => void) | undefined>()
const unbindAudioElement = ref<(() => void) | undefined>()

async function getProfiles() {
  return await $fetch('/api/profiles')
}

async function fetchProfilesAndSetCallId() {
  try {
    const profiles = await getProfiles()
    const profile = profiles.find((profile) => profile.username === callId.value)
    callId.value = profile?.username || null
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

onMounted(() => {
  if (props.call?.id) {
    fetchProfilesAndSetCallId()

    if (videoElement.value) {
      unbindVideoElement.value = props.call?.bindVideoElement(
        videoElement.value, 
        props.participant?.sessionId || 'sessionId',
        'videoTrack'
      ) 
    }
    if (audioElement.value) {
      unbindAudioElement.value = props.call?.bindAudioElement(
        audioElement.value,
        props.participant?.sessionId || 'sessionId',
      )
    }
  }
})

onUnmounted(() => {
  unbindVideoElement.value?.()
  unbindAudioElement.value?.()
})
</script>

<style scoped>
video {
  object-fit: contain;
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
