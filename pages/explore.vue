<template>
  <div class="explore place-content-center">
    <div class="profilescont text-left">
      <h1 class="text-3xl font-bold">
        Explore
        <span class="verified">{{ searchResults.filter(n => n.username).length }}</span>
      </h1>
      <input
        class="cards search mt-10"
        placeholder="Search for an ollo..."
        v-model="searchTerm"
        @input="handleChange"
      />
    </div>
    <div class="grid profilescont grid-cols-8 gap-5 paddinghero">
      <div
        v-for="profile in filteredSortedProfiles"
        :key="profile.id"
        class="grid col-span-2 auto-rows-max"
      >
        <div class="cards center paddingnone justify-center items-center overflow-hidden md:max-w-sm rounded-lg shadow-sm mx-auto">
          <nuxt-link :to="`/${profile?.username}`" class="none">
            <div class="grid-card dark p-5">
              <div class="center avatarcont">
                <img class="avatar" :src="profile.avatar ? profile.avatar : 'avatar.png'" />
              </div>
              <div class="info mt-4 center">
                <h1 class="username center">{{ profile.username }}</h1>
                <div>
                  <span class="handle">{{ profile.handle }}</span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="mb-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
const supabase = useSupabaseClient();

    const avatar = 'avatar.png';
    const searchTerm = ref('');
    const profiles = ref([]);
    const searchResults = ref([]);

    const handleChange = () => {
      if (profiles.value) {
        searchResults.value = profiles.value.filter(
          profile =>
            profile.username !== null &&
            profile.username.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      }
    };

    const fetchProfiles = async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        throw new Error(error.message);
      }
      profiles.value = data;
      searchResults.value = data;
    };

    onMounted(() => {
      fetchProfiles();
    });

    const filteredSortedProfiles = computed(() => {
      return searchResults.value
        .filter(n => n.username)
        .sort((a, b) => a.username.localeCompare(b.username));
    });

</script>