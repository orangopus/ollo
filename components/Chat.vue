<template>
  <div class="chat fixed right-0 h-screen text-white justify-center">
    <div class="messages" ref="messagesContainer">
      <p class="message">Chatting with {{ channelName }}</p>
      <div v-for="(message, index) in messages" :key="index" class="message">
        <img :src="getAvatar(message.user)" alt="Avatar" width="40" height="40" class="avatar chatavatar"/>
        <span class="user">{{ getUsername(message.user) }}</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const channelName = route.params.username; // Hardcoded to 'cheese'
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const messages = ref([]);
const newMessage = ref('');
const profiles = ref({});
const messagesContainer = ref(null);

const fetchMessages = async () => {
  try {
    const { data: messageData, error: messageError } = await supabase
      .from('chat')
      .select('*')
      .eq('channel', channelName)
      .order('created_at', { ascending: true });

    if (messageError) {
      throw messageError;
    }

    messages.value = messageData.map(msg => ({
      id: msg.id,
      user: msg.user_id,
      text: msg.content,
      // Fetch the corresponding profile from profiles.value
      username: getUsername(msg.user_id),
      avatar: getAvatar(msg.user_id),
    }));

    const userIds = messageData.map(msg => msg.user_id);
    await fetchProfiles(userIds);
    scrollToBottom();
  } catch (error) {
    console.error('Error fetching messages:', error.message);
  }
};


const fetchProfiles = async (userIds) => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    if (profileError) {
      throw profileError;
    }

    console.log('Fetched profiles:', profileData);

    // Clear profiles.value to ensure no stale data
    profiles.value = {};

    profileData.forEach(profile => {
      profiles.value[profile.id] = {
        username: profile.username,
        avatar: profile.avatar,
      };
    });

    console.log('Stored profiles:', profiles.value); // Log stored profiles for verification
  } catch (error) {
    console.error('Error fetching profiles:', error.message);
  }
};


const getUsername = (userId) => {
  const profile = profiles.value[userId];
  return profile ? profile.username : 'Unknown';
};

const getAvatar = (userId) => {
  const profile = profiles.value[userId];
  return profile ? profile.avatar : '/avatar.png';
};

const sendMessage = async () => {
  try {
    if (newMessage.value.trim() === '') {
      return;
    }

    const { data, error } = await supabase
      .from('chat')
      .insert([{ user_id: user.value.id, content: newMessage.value, channel: channelName }])
      .select();

    if (error) {
      throw error;
    }

    const addedMessage = data[0];
    messages.value.push({
      id: addedMessage.id,
      user: addedMessage.user_id,
      text: addedMessage.content,
    });

    fetchProfiles([addedMessage.user_id]); // Update profile for new message user
    newMessage.value = '';
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  fetchMessages();
});

watch(messages, () => {
  scrollToBottom();
});
</script> 

<style scoped>

.user {
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
  padding: 2px 10px;
  background: #0F141F;
  border-radius: 20px;
  height: 100%;
}
.messages {
  overflow-y: auto;
  margin-bottom: 25px;
  box-shadow: inset 0px 4px 56px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  width: 310px;
  filter: drop-shadow(0px 4px 44px rgba(0, 0, 0, 0.25));
  height: 100%;
}
.chat {
  position: fixed;
    z-index: 100;
    height: 90vh;
    right: 0;
    margin-right: 20px;
}
.message {
  margin: 5px 20px 0 25px;
  display: flex;
}
input {
  width: 100%;
  padding: 5px;
  margin: 0;
  /* Rectangle 2 */

  width: 310px;
  height: 56px;

  background: #0F141F;
  border-radius: 31px;

}
</style>

