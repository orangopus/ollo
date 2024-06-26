<template>
    <div>
      <Nav/>
      <slot/>
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