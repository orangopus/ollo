<template>
    <div>
    <div class="grid grid-card container profilescont center p-5">
    <div class="items-center justify-center center"
      :style="{ background: `url(https://${profile?.background_url})` }"
    >
      <div class="center avatarcont" style="text-align: center;">
        <img
          class="avatar mt-10"
          :src="profile.avatar"
          alt="Avatar"
        />
      </div>
      <div class="info mt-8 center" style="text-align: center;">
        <h1 class="username">
          {{ twitch?.display_name || profile.displayname }}
          <span class="handle">@{{ twitch?.login || profile?.username }}</span>
        </h1>
        <p class="bio">{{ twitch?.description || profile?.bio }}</p>
      </div>
      <br />
      <div class="socials flex center justify-center">
        <div v-for="social in social" :key="social.user_id">
          <a :href="social.url" target="_blank" class="mb-4 mx-4 rounded-lg text-center justify-items-center items-center">
            <Icon :name="`fa6-brands:${social.icon}`" class="text-5xl socialicon rounded-full" 
                        :style="{ color: social.color , backgroundColor: social.background_color, placeContent: center }" /> 
          </a>
        </div>
        </div>
        <br/>
      <div v-if="twitch">
        <nuxt-link to="/login">
          <button class="button center">Claim Profile</button>
        </nuxt-link>
      </div>
    </div>
  </div>
  </div>
</template>
  
<script setup lang="ts">
const supabase = useSupabaseClient()

const user = useSupabaseUser()

const { username } = useRoute().params

const profiles = await getProfiles()

const profile = profiles.find((profile) => profile.username === username)

const socials = await getSocials()

const social = socials.filter((social) => social.user_id === profile?.id)

console.log(profile?.displayname)

async function getProfiles(){
  return await $fetch('/api/profiles')
}

async function getSocials(){
  return await $fetch('/api/socials')
}

useHead({
  title: `${profile.displayname} on ollo`,
  charset: 'utf-8',
  meta: [{ name: 'description', content: profile.bio }],
  link: [{ rel: 'icon', type: 'image/png', href: profile.avatar}],
})

</script>