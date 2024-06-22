<template>
  <div id="video_box">
    <div>
      <NuxtLink :to="`/${profileUsername}/live`">
        <video ref="videoElement" class="video-js vjs-default-skin" playsinline controls></video>
        <audio ref="audioElement"></audio>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Call, StreamVideoParticipant } from '@stream-io/video-client'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

// Define props
const props = defineProps<{
  call: Call | undefined 
  participant: StreamVideoParticipant | undefined
}>()

// Setup reactive references
const route = useRoute()
const callId = ref(route.params.username)
const videoElement = ref<HTMLVideoElement | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)
const unbindVideoElement = ref<(() => void) | undefined>()
const unbindAudioElement = ref<(() => void) | undefined>()
const profileUsername = ref<string | null>(null)

// Fetch profiles and set call ID
async function getProfiles() {
  try {
    const profiles = await $fetch('/api/profiles')
    const profile = profiles.find((profile) => profile.username === callId.value)
    profileUsername.value = profile?.username || null
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

// Check if the current route is the specific page
const isSpecificPage = computed(() => route.path === `/${profileUsername.value}/live`)

onMounted(async () => {
  if (props.call?.id) {
    await getProfiles()

    const player = videojs(videoElement.value, {
      autoplay: true,
      controls: true,
      'videoTracks': 'videoTrack',
      sources: [{
        src: props.call?.state.egress?.hls?.playlist_url || '',
        type: "application/x-mpegURL"
      }],
      playbackRates: [0.5, 1, 1.5, 2], // Adjust playback rates if supported
      html5: {
    hls: {
      enableLowInitialPlaylist: true, // Adjust if necessary
      smoothQualityChange: true,
      overrideNative: true,
    },
    nativeAudioTracks: false, // Disable native audio tracks for better control
    nativeVideoTracks: false, // Disable native video tracks for better control
  },
    })

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
        props.participant?.sessionId || 'sessionId'
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
  width: calc(73.5vw - 20px);
}

#video_box {
  width: initial;
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
