<template>
  <div>
    <client-only>
    <section v-if="isCallLive">
      <Video v-if="call && localParticipant" :call="call" :participant="localParticipant" />
    </section>
    <section v-else="!isCallLive">
      <input type="text" class="input" v-model="callId" placeholder="Enter a username" />
      <button @click="startBroadcast" class="button red">Start Broadcast</button>
    </section>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useStreamStore from '@/stores/getstream.client'

const store = useStreamStore()
const { call, localParticipant } = storeToRefs(store)

const callId = ref('')

const isCallLive = computed(() => {
return call.value && localParticipant.value
})

function startBroadcast() {
  if (callId.value) {
    store.createCall(callId.value)
  }
}

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
