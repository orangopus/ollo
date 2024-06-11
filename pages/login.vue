<template>
    <div class="flex items-center justify-center min-h-screen">
        <button class="button blurple" @click="signInWithOAuth">
          <Icon name="fa6-brands:discord" class="navicon"/> Login With Discord
        </button>
    </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: '/dashboard',
    },
  })
  if (error) console.log(error)
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
}

if (user.value) {
  navigateTo('/dashboard')
}
</script>

<style scoped>

</style>