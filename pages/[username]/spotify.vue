<template>
    <body style="background: transparent !important">
      <Spotify />
    </body>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import Spotify from '@/components/Spotify.vue'; 
  const routes = useRoute().params;

  definePageMeta({
    layout: 'overlays'
  });

  const router = useRouter();
  
  // If you need to perform any router-related logic, you can use `router` here
  </script>

  <style scoped>
    body {
        background-color: transparent !important;
        margin: 0 !important;
    }

    nav {
        display: none;
    }
</style>