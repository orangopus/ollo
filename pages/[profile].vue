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
    <section v-if="showRemoteVideo">
    <div class="grid grid-card container profilescont center p-5">
          <ClientOnly>
            <NuxtLink :to="`/${profile.username}/live`">
            <Video :call="call" :participant="remoteParticipant" />
          </NuxtLink>
          </ClientOnly>
    </div>
  </section>
  <div class="w-full sm:px-0">
      <TabsWrapper>
        <Tab title="Posts">
          <div v-for="post in posts" :key="post.id" class="grid cards postcard">
      <div class="flex">
        <div class="flex-col ml-0 mr-0">
          <a :href="`/${post.username}`">
            <img class="avatar avatar3" :src="post.avatar" :alt="`${post.username} avatar`" />
          </a>
        </div>
        <div class="info flex ml-4">
          <h1 class="username mb-2 left">
            {{ post.displayname || post.username }}
            <span class="handle">
              <span v-if="post.verified" class="verify">
                <font-awesome-icon :icon="['fas', 'check']" />
              </span>
            </span>
            <span class="handle">@{{ post.username }}</span>
            <br />
            <a class="minutesago" :href="`posts/${post.id}`">
              {{ formatPostDate(post.published_at) }}
            </a>
          </h1>
          <br />
        </div>
      </div>
      <p class="postcontent grid">
        {{ post.content }}
      </p>
      <div class="replies">
        <div
          v-for="reply in replies.filter((reply) => reply.post_id === post.id)"
          :key="reply.id"
          class="postcontent mb-4"
        >
          <img
            v-if="reply.avatar"
            data-tooltip-id="avatarTooltip"
            :data-tooltip-content="reply.username"
            class="avatar avatar3"
            :src="reply.avatar"
            :alt="reply.username"
          />
          <tooltip id="avatarTooltip" />
          <p class="reply-content mt-3">{{ reply.content }}</p>
          <p>
            <span class="reply-author minutesago mt-3">
              {{ formatDate(reply.created_at) }}
            </span>
          </p>
        </div>
      </div>
      <div>
        <span class="minutesago mt-6 mr-3">
          <Like :postId="post.id" :initialLikes="post.likes" /> {{ post.likes }}
        </span>
        <button class="minutesago mr-3" @click="toggleReplyInput(post.id)">
          reply
        </button>
        <button v-if="post.author_id === (user && user.id)" @click="deletePost(post.id)" class="bg-red-500 text-gray-200 minutesago">
          delete
        </button>
      </div>
      <form v-if="replyInputs[post.id]" class="reply-form" @submit.prevent="handleReplySubmit(post.id)">
        <textarea name="reply" placeholder="Write a reply..." class="textarea reply-input" v-model="replyContent" />
        <button type="submit" class="button reply-submit">Reply</button>
      </form>
    </div>
        </Tab>
        <Tab title="About">
          <div class="grid grid-card container profilescont center p-5">
            <MDC :value="profile.html"/>
          </div>
        </Tab>
        <Tab title="VODs">
          <div class="grid grid-card container profilescont center p-5">
            <div class="flex container flex-wrap">
              <ClientOnly>
              <div v-for="recording in recordings" class="w-1/3 px-2 py-2">
                <!-- Display each recording -->
                <video class="vod" :src="recording.url" controls></video>
              </div>
              </ClientOnly>
            </div>
          </div>
        </Tab>
      </TabsWrapper>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useStreamStore from '@/stores/getstream.client';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';

dayjs.extend(relativeTime);

const items = [{
  key: 'posts',
  label: 'Posts',
  description: 'View and manage your posts here',
}, {
  key: 'about',
  label: 'About',
  description: 'Update your profile information here',
}]

const activeTab = ref('posts'); // Assuming 'posts' is the default active tab

// Function to switch active tab
const switchTab = (tabKey: string) => {
  activeTab.value = tabKey;
};

const supabase = useSupabaseClient()

const user = useSupabaseUser()

const username = useRoute().params.profile

const profiles = await getProfiles()

const profile = profiles.find((profile) => profile.username === username)

const socials = await getSocials()

const social = socials.filter((social) => social.user_id === profile?.id)

const store = useStreamStore();
const { call, remoteParticipant } = storeToRefs(store);

const callId = ref(profile.username)

const recordings = ref([])

const showRemoteVideo = computed(() => {
  return call.value && remoteParticipant.value;
});

function watchStream() {
  if (callId.value) {
    store.watchStream(callId.value);
  }

}

async function getProfiles(){
  return await $fetch('/api/profiles')
}

async function getSocials(){
  return await $fetch('/api/socials')
}

const posts = ref([]);
const replies = ref([]);
const newPost = ref('');
const error = ref<string | null>(null);
const replyInputs = reactive<Record<number, boolean>>({});
const replyContent = ref('');

onMounted(async () => {
  await fetchPosts();
  await fetchReplies();
  await watchStream();
  await fetchRecordings();  // Fetch recordings when component mounts
});

watch(call, async () => {
  await fetchRecordings();
});

async function fetchRecordings() {
  try {
    if (call.value) {
      const response = await call.value.queryRecordings();
      if (response) {
        recordings.value = response.recordings;
      }
    }
  } catch (err) {
    console.error('Error fetching recordings:', err.message);
  }
}

async function fetchPosts() {
  try {
    const { data, error: fetchError } = await supabase.from('posts_with_likes').select().order('id', { ascending: false }).eq("username", username);
    if (fetchError) {
      throw fetchError;
    }
    posts.value = data;
  } catch (err) {
    console.error('Error fetching posts:', err.message);
  }
}

async function fetchReplies() {
  try {
    const { data, error: fetchError } = await supabase.from('reply_with_profile').select('*').order('id', { ascending: true });
    if (fetchError) {
      throw fetchError;
    }
    replies.value = data;
  } catch (err) {
    console.error('Error fetching replies:', err.message);
  }
}

function formatDate(date: string) {
  return dayjs(date).fromNow();
}

function formatPostDate(dateString: string) {
  const date = new Date(dateString);
  const real_time = date.getTime();
  const minutesOffset = new Date().getTimezoneOffset();
  return dayjs(new Date(real_time + minutesOffset * -1 * 60 * 1000)).fromNow();
}

async function handlePostSubmit() {
  try {
    if (!user.value) {
      throw new Error('User not authenticated');
    }
    const { data, error: postError } = await supabase.from('posts').insert([{ content: newPost.value, user_id: user.value.id }]);
    if (postError) {
      throw postError;
    }
    newPost.value = '';
    await fetchPosts(); // Refresh posts after submission
    console.log('Post submitted successfully:', data);
  } catch (err) {
    error.value = 'Error submitting post: ' + err.message;
    console.error('Error submitting post:', err);
  }
}

async function editPosts(content: string, postId: number) {
  try {
    const { data, error: editError } = await supabase.from('posts').update({ content }).eq('id', postId);
    if (editError) throw editError;
    await fetchPosts(); // Refresh posts after editing
    console.log('Post updated successfully:', data);
  } catch (err) {
    error.value = 'Error updating post: ' + err.message;
    console.error('Error updating post:', err);
  }
}

async function deletePost(postId: number) {
  try {
    const { error: deleteRepliesError } = await supabase.from('replies').delete().eq('post_id', postId);
    if (deleteRepliesError) throw deleteRepliesError;

    const { data, error: deletePostError } = await supabase.from('posts').delete().eq('id', postId);
    if (deletePostError) throw deletePostError;

    await fetchPosts(); // Refresh posts after deletion
    console.log('Post and its replies deleted successfully:', data);
  } catch (err) {
    error.value = 'Error deleting post: ' + err.message;
    console.error('Error deleting post:', err);
  }
}

async function postReply(content: string, postId: number) {
  try {
    if (!user.value) {
      throw new Error('User not authenticated');
    }
    const { data, error: replyError } = await supabase.from('replies').insert([{ content, post_id: postId, user_id: user.value.id }]);
    if (replyError) throw replyError;
    await fetchReplies(); // Refresh replies after submission
    console.log('Reply submitted successfully:', data);
  } catch (err) {
    error.value = 'Error submitting reply: ' + err.message;
    console.error('Error submitting reply:', err);
  }
}

function toggleReplyInput(postId: number) {
  replyInputs[postId] = !replyInputs[postId];
}

async function handleReplySubmit(postId: number) {
  try {
    await postReply(replyContent.value, postId);
    replyContent.value = '';
  } catch (err) {
    error.value = 'Error submitting reply: ' + err.message;
    console.error('Error submitting reply:', err);
  }
}

useHead({
  title: `${profile.displayname} on ollo`,
  charset: 'utf-8',
  meta: [{ name: 'description', content: profile.bio }],
  link: [{ rel: 'icon', type: 'image/png', href: profile.avatar}],
})

</script>

<style scoped>
.active {
    background: #000000;
  }
</style>