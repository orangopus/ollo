// Chat.vue
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

<script>
export default {
  data() {
    return {
      messages: [],
      newMessage: '',
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        this.messages.push({ user: 'You', text: this.newMessage });
        this.newMessage = '';
        // Emit the message to the parent component or send to the server
        this.$emit('message-sent', { user: 'You', text: this.newMessage });
      }
    },
    receiveMessage(message) {
      this.messages.push(message);
    },
  },
};
</script>

<style scoped>
.chat {
  border: 1px solid #ccc;
  padding: 10px;
  width: 300px;
}
.messages {
  height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.message {
  margin: 5px 0;
}
input {
  width: calc(100% - 20px);
  padding: 5px;
}
</style>
