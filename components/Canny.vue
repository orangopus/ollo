<template>
  <div class="center">
    <!-- Canny changelog container -->
    <p class="mt-5 minutesago version center text-center" data-canny-changelog>Version: v3</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Ensure to use your actual Canny App ID
const cannyAppId = '5d1c775f723f2266bea9bd2c';

onMounted(() => {
  initCanny();
});

function initCanny() {
  Canny('initChangelog', {
    appID: cannyAppId,
    element: '#canny-changelog',
    position: 'bottom',
    align: 'left',
    theme: 'dark'
  });
}
</script>