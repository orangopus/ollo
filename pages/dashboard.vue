<template>
  <div class="min-h-screen center ">
    <!-- Profile Picture Upload -->
    <div class="flex items-center center uploadcard mb-5">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="avatar object-cover" />
          <svg v-else class="w-full h-full text-gray-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <p class="my-5 text-sm text-gray-500 dark:text-gray-400">
            <span class="text-blue-500 dark:text-blue-400">Upload</span> your profile picture
          </p>
        </div>
        <input id="dropzone-file" type="file" @change="updateAvatar" class="hidden" />
      </label>
    </div>
    <!-- User Info Forms -->
    <div class="ml-10 mb-10">
      <h2 class="edit center">Display name</h2>
    <input v-model="displayname" type="text" placeholder="Set display name" class="input" />

    <h2 class="edit center">Username</h2>
    <input v-model="username" type="text" placeholder="Set username" class="input" />

    <h2 class="edit center">Bio</h2>
    <textarea v-model="bio" placeholder="Set bio" class="input bio-h"></textarea>

    <h2 class="edit center">HypeRate</h2>
    <input v-model="hyperate" type="text" placeholder="HypeRate ID" class="input cursor-not-allowed" disabled/>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-10">HypeRate feature is currently scheduled under maintenance due to websocket flooding.</p>
    <br/>
    <!-- Custom Domain Form -->
    <form @submit.prevent="handleSubmit" disabled>
      <h2 class="edit center">Custom Domain</h2>
      <input v-model="customDomain" disabled type="text" class="input cursor-not-allowed" />
      <br />
      
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>

    <h2 class="edit center">Pally.gg</h2>
    <input v-model="pally" type="text" placeholder="Pally Username" class="input" />

    <!-- Other Components -->
    <EditSocialItem />
    <br />
    <nuxt-link :to="`/${username}`">
      <button class="button mb-5">View Profile</button>
    </nuxt-link>
    <br />
    <button @click="handleSpotify" class="button">Connect Spotify</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const displayname = ref('')
const username = ref('')
const bio = ref('')
const hyperate = ref('')
const avatarUrl = ref('')
const pally = ref('')
const customDomain = ref('')
const error = ref('')
const lastNotificationTime = ref(0)
const spotifyToken = ref('')

const handleSpotify = () => {
  const clientId = config.SPOTIFY_CLIENT_ID
  const redirectUri = config.SPOTIFY_REDIRECT_URI
  const scopes = 'user-read-private user-read-email'
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`
  window.location.href = authUrl
}

const handleSubmit = async () => {
  try {
    await supabase.from('profiles').update({ custom_domain: customDomain.value }).eq('id', user.value.id)
    const domain = { name: customDomain.value }

    await axios.post(`/v10/projects/${config.VERCEL_PROJECT_ID}/domains?teamId=team_A8VB8liqd3xy1xyKgQCizpMW`, domain, {
      headers: {
        Authorization: `Bearer ${config.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (updateError) {
    error.value = updateError.message
  }
}

const updateAvatar = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const fileName = user.value.id
  const filePath = `public/avatars/${fileName}?updated`

  try {
    const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file, {
      cacheControl: '1000',
      upsert: true,
    })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = await supabase.storage.from('uploads').getPublicUrl(filePath)
    if (error) throw error

    avatarUrl.value = publicUrl
  } catch (error) {
    console.error('Error uploading avatar:', error.message)
  }
}

const updateField = async (field, value) => {
  try {
    await supabase.from('profiles').update({ [field]: value }).eq('id', user.value.id)
    if (Date.now() - lastNotificationTime.value > 5000) {
      lastNotificationTime.value = Date.now()
    }
  } catch (error) {
    console.error(`Error updating ${field}:`, error.message)
  }
}

onMounted(async () => {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
    if (data) {
      displayname.value = data.displayname
      username.value = data.username
      bio.value = data.bio
      hyperate.value = data.heartbeat
      pally.value = data.pally
      customDomain.value = data.custom_domain
    }

    const { data: { publicUrl } } = await supabase.storage.from('uploads').getPublicUrl(`public/avatars/${user.value.id}?updated`)
    avatarUrl.value = publicUrl
  } catch (error) {
    console.error('Error fetching user profile:', error.message)
  }

  try {
    const { data } = await supabase.from('spotify').select('access_token').eq('user_id', user.value.id).single()
    if (data) {
      spotifyToken.value = data.access_token
    }
  } catch (error) {
    console.error('Error fetching Spotify token:', error.message)
  }
})

watch(displayname, (newValue) => updateField('displayname', newValue))
watch(username, (newValue) => updateField('username', newValue))
watch(bio, (newValue) => updateField('bio', newValue))
watch(hyperate, (newValue) => updateField('heartbeat', newValue))
watch(pally, (newValue) => updateField('pally', newValue))
watch(customDomain, (newValue) => updateField('custom_domain', newValue))
</script>
