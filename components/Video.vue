<template>
  <div id="video_box">
    <div>
      <NuxtLink :to="`/${profileUsername}/live`">
        <video ref="videoElement" class="video-js vjs-default-skin" controls></video>
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
const callId = ref<string | null>()
const videoElement = ref<HTMLVideoElement | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)
const unbindVideoElement = ref<(() => void) | undefined>()
const unbindAudioElement = ref<(() => void) | undefined>()
const profiles = ref([] as Array<{ username: string }>)
const profileUsername = computed(() => {
  const username = route.params.username || route.params.profile
  const profile = profiles.value.find((profile) => profile.username === username)
  return profile?.username || ''
})

// Fetch profiles and set call ID

async function getProfiles() {
  const response = await $fetch('/api/profiles')
  profiles.value = response
}


onMounted(async () => {
  if (props.call?.id) {
    await getProfiles()

    const player = videojs(videoElement.value, {
      autoplay: true,
      controls: true,
      sources: [{
        src: props.call?.state.egress?.hls?.playlist_url || '',
        type: "application/x-mpegURL"
      }],
    })

    const audioTrackUrl = props.participant?.audioStream?.getAudioTracks()

    if (audioTrackUrl) {
      player.addRemoteTextTrack({
        kind: 'captions',
        src: audioTrackUrl,
        srclang: 'en',
        label: 'English',
      }, true)
    }
    }

    if (videoElement.value) {
      unbindVideoElement.value = props.call?.bindVideoElement(
        videoElement.value,
        props.participant?.sessionId || 'sessionId',
        'videoTrack'
      )
    }

  }
)

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
