<template>
  <div class="chat">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="user">{{ message.user }}:</span>
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
const channel = route.params.username;
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const messages = ref([]);
const newMessage = ref('');

const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .eq('channel', channel)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
  } else {
    messages.value = data.map(msg => ({ user: msg.user_id, text: msg.content }));
  }
};

const subscribeToMessages = () => {
  supabase
    .channel('public:chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, payload => {
      const newMessage = payload.new;
      if (newMessage.channel === channel) {
        messages.value.push({ user: newMessage.user_id, text: newMessage.content });
      }
    })
    .subscribe();
};

const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const { error } = await supabase
      .from('chat')
      .insert([{ user_id: user.value.id, content: newMessage.value, channel: channel }]);
    
    if (error) {
      console.error('Error sending message:', error);
    } else {
      newMessage.value = '';
    }
  }
};

onMounted(() => {
  fetchMessages();
  subscribeToMessages();
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

