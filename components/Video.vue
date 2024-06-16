<template>
    <video ref="videoElement" class="rounded-xl"/>
    <audio ref="audioElement" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Call, StreamVideoParticipant } from '@stream-io/video-client'

const props = defineProps<{
  call: Call | undefined 
  participant: StreamVideoParticipant | undefined
}>()

const videoElement = ref<HTMLVideoElement | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)
const unbindVideoElement = ref<(() => void) | undefined>()
const unbindAudioElement = ref<(() => void) | undefined>()

onMounted(() => {
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
})

onUnmounted(() => {
  unbindVideoElement.value?.()
  unbindAudioElement.value?.()
})
</script>

<style>
video {
  object-fit: contain;
}
</style>