<template>
  <nav class="navbar fixed top-0 left-1 h-screen text-white flex flex-wrap justify-center">
    <a class="navbar-brand" href="/">
      <img class="logo" src="../public/logo.svg" alt="Logo" />
    </a>
    <form class="mt-15 navmargin">
      <div>
        <NuxtLink to="/home" class="buttonwhite justify-center flex justify-center w-full center">
          <Icon name="fa6-solid:house" class="navicon"/>
          <span class="tooltip">Home</span>
        </NuxtLink>
        <NuxtLink to="/explore" class="buttonwhite justify-center flex justify-center w-full center">
          <Icon name="fa6-solid:bars-staggered" class="navicon"/>
          <span class="tooltip">Explore</span>
        </NuxtLink>
      </div>
      <div v-if="user && user.id" class="absolute bottom-0 absolute">
        <button
          id="dropdownAvatarNameButton"
          @click.prevent="toggleDropdown"
          class="flex items-center relative"
          type="button"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="avatar avatar2 center"
            :src="user.user_metadata.avatar_url"
            alt="User Avatar"
          />
          <span class="tooltip">User Menu</span>
        </button>

        <!-- Dropdown menu -->
        <div
          v-show="isDropdownVisible"
          id="dropdownAvatarName"
          class="dropdown-menu z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 absolute right-0 mt-2"
        >
          <div class="px-4 py-3 text-sm text-white dark:text-white">
            <div class="font-medium">{{ profile?.displayname }}</div>
            <div class="font-medium bold">{{ user.email }}</div>
          </div>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownAvatarNameButton">
            <li><NuxtLink class="block px-4 py-2 hover:bg-gray-800 hover:rounded-full dark:hover:bg-black dark:hover:text-white" to="/dashboard">Dashboard</NuxtLink></li>
            <li><NuxtLink class="block px-4 py-2 hover:bg-gray-800 hover:rounded-full dark:hover:bg-black dark:hover:text-white" :to="`${profile?.username}`">Profile</NuxtLink></li>
          </ul>
          <div class="py-2">
            <a href="#" @click="signOut" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-800 hover:rounded-full dark:hover:bg-black dark:text-red-600 dark:hover:text-red">Sign out</a>
          </div>
        </div>
      </div>
      <NuxtLink v-else to="/login" class="mt-2.5 bottom-0 buttonwhite loginbutton">
        <Icon name="solar:user-broken" class="navicon"/>
        <span class="tooltip">Login</span>
      </NuxtLink>
    </form>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const isDropdownVisible = ref(false)

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value
}

const profiles = await getProfiles()

// Check if user.value and user.value.id are defined before attempting to find the profile
const profile = user.value ? profiles.find((profile) => profile.id === user.value.id) : null

async function getProfiles() {
  if (user) {
    try {
      return await $fetch('/api/profiles')
    } catch (error) {
      console.error('Error fetching profiles:', error)
      return []
    }
  }
  return []
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  return navigateTo('/')
}
</script>

<style scoped>
/* Include the custom tooltip styles here */
.tooltip {
  @apply absolute bg-gray-700 text-white text-xs rounded py-1 px-2;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
  font-size: large;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  margin-top: 20px;
  left: 5rem; /* Position tooltip to the right */
}

.navicon:hover + .tooltip,
.buttonwhite:hover + .tooltip {
  opacity: 1;
}

.dropdown-menu {
  position: absolute; /* Absolute positioning within the parent */
  left: 200px; /* Position it to the right of the avatar */
  bottom: 120px; /* Align to the bottom */
  margin-left: 10px; /* Optional: add some spacing */
  border-radius: 25px; /* Keep the border radius */
  z-index: 1000; 
}

li {
  list-style-type: none;
}
</style>
