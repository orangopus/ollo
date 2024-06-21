<template>
  <div class="chat">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <img :src="getAvatar(message.user)" alt="avatar" class="avatar chatavatar"/>
        <span class="user">{{ getUsername(message.user) }}</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  const { data: messageData, error: messageError } = await supabase
    .from('chat')
    .select('*')
    .eq('channel', channelName)
    .order('created_at', { ascending: true });

  if (messageError) {
    console.error('Error fetching messages:', messageError);
  } else {
    messages.value = messageData.map(msg => ({ user: msg.user_id, text: msg.content }));
    await fetchProfiles(messageData.map(msg => msg.user_id));
    scrollToBottom();
  }
};

const fetchProfiles = async (userIds) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (profileError) {
    console.error('Error fetching profiles:', profileError);
  } else {
    profiles.value = profileData.reduce((acc, profile) => {
      acc[profile.id] = { username: profile.username, avatar: profile.avatar };
      return acc;
    }, {});
  }
};

const getUsername = (userId) => {
  return profiles.value[userId]?.username || 'Unknown';
};

const getAvatar = (userId) => {
  return profiles.value[userId]?.avatar || 'default-avatar.png'; // Provide a default avatar if none is available
};

const subscribeToMessages = () => {
  supabase
    .channel('public:chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, async payload => {
      const newMessage = payload.new;
      if (newMessage.channel === channelName) {
        messages.value.push({ user: newMessage.user_id, text: newMessage.content });
        await fetchProfiles([newMessage.user_id]);
        scrollToBottom();
      }
    })
    .subscribe();
};

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const { error } = await supabase
      .from('chat')
      .insert([{ user_id: user.value.id, content: newMessage.value, channel: channelName }]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      // Add the new message to the local messages array immediately
      messages.value.push({ user: user.value.id, text: newMessage.value });
      newMessage.value = '';
      scrollToBottom();
    }
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  fetchMessages();
  subscribeToMessages();
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
}
.messages {
  overflow-y: auto;
  margin-bottom: 25px;
  box-shadow: inset 0px 4px 56px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  width: 310px;
  background:rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0px 4px 44px rgba(0, 0, 0, 0.25));
  height: 94%;
}
.chat {
  position: absolute;
    z-index: 100;
    height: 93%;
    right: 0;
    padding: 20px 0 0 20px;
    margin-right: 20px;
    display: block;
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

