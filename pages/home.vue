<template>
  <div>
    <div v-if="user" class="cards flex">
      <img class="avatar" :src="user.user_metadata.avatar_url" alt="User Avatar" />
      <form class="postcontainer" @submit.prevent="handlePostSubmit">
        <div class="postcontainer">
          <textarea
            id="clearPost"
            name="post"
            placeholder="What have you done today?"
            class="textarea postinput"
            v-model="newPost"
          />
          <button class="button postsubmit" type="submit">
            Post
          </button>
          <p class="postmarkdown">
            <font-awesome-icon :icon="['fab', 'markdown']" /> is supported
          </p>
        </div>
      </form>
    </div>

    <div v-for="post in posts" :key="post.id" class="cards postcard">
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
        <button class="minutesago mr-3" @click="toggleLike(post.id)">
          <Icon :name="post.liked ? 'icon-park-solid:like' : 'icon-park-outline:like'" class="mr-1" />
          {{ post.likes }}
        </button>
        <button class="minutesago mr-3" @click="toggleReplyInput(post.id)">
          reply
        </button>
        <button v-if="post.author_id === user.id" @click="deletePost(post.id)" class="bg-red-500 text-gray-200 minutesago">
          delete
        </button>
      </div>
      <form v-if="replyInputs[post.id]" class="reply-form" @submit.prevent="handleReplySubmit(post.id)">
        <textarea name="reply" placeholder="Write a reply..." class="textarea reply-input" v-model="replyContent" />
        <button type="submit" class="button reply-submit">Reply</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const posts = ref([]);
const replies = ref([]);
const likes = await fetchLikes();
const newPost = ref('');
const error = ref<string | null>(null);
const replyInputs = reactive<Record<number, boolean>>({});
const replyContent = ref('');

onMounted(async () => {
  await fetchPosts();
  await fetchReplies();
  await fetchLikes();
});

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

async function fetchLikes(){
  return await $fetch('/api/likes')
}

async function fetchPosts() {
  try {
    const { data, error: fetchError } = await supabase
      .from('posts_with_likes')
      .select()
      .order('id', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    // Fetch likes for each post for the current user
    const postIds = data.map(post => post.id);
    const { data: likesData, error: likesError } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', user.value?.id)
      .in('post_id', postIds);

    if (likesError) {
      throw likesError;
    }

    // Map liked post IDs for efficient lookup
    const likedPostIds = new Set(likesData.map(like => like.post_id));

    // Merge likes into posts data
    data.forEach(post => {
      post.likes = post.likes || 0; // Ensure likes count is initialized
      post.liked = likedPostIds.has(post.id); // Check if current user has liked this post
    });

    posts.value = data;
  } catch (err) {
    console.error('Error fetching posts:', err.message);
  }
}


async function toggleLike(post) {
  try {
    if (!user.value) {
      throw new Error('User not authenticated');
    }

    const likedByUser = post.liked;

    if (likedByUser) {
      // Unlike post
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.value.id);

      if (error) {
        throw error;
      }

      // Update local state
      post.likes -= 1;
      post.liked = false;

    } else {
      // Like post
      const { data, error } = await supabase
        .from('likes')
        .insert({
          post_id: post.id,
          user_id: user.value.id,
        });

      if (error) {
        throw error;
      }

      // Update local state
      post.likes += 1;
      post.liked = true;
    }

  } catch (error) {
    console.error('Error toggling like:', error.message);
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

watchEffect(() => {
  if (!user.value) {
    return navigateTo('/login')
  }
})
</script>

<style scoped>
/* Add your styles here */
</style>
