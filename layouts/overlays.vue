<template>
    <div>
      <Nav/>
      <div class="margin">
        <slot/>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const supabase = useSupabaseClient()
  
  const user = useSupabaseUser()
  
  const { username } = useRoute().params
  
  const { data: profile } = await useAsyncData('profiles', async () => {
    const { data } = await supabase.from('profiles').select("*")
  
    return data
  })
  </script>