<template>
  <v-flex>
    <v-card width="100%" height="100%">
      <div v-for="(message, index) in messages" :key="index">
        <ChatMessage :message="message" />
      </div>
      <v-textarea v-model="message"
        @keydown.enter.exact.prevent
        @keyup.enter.exact="triggerSendMessage"
        @keydown.enter.shift.exact="newline"
        label="Text message"></v-textarea>
      <v-btn @click="triggerSendMessage">Send</v-btn>
    </v-card>
  </v-flex>
</template>

<script>
import ChatMessage from './ChatMessage'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['roomName'],
  components: {
    ChatMessage
  },
  data: () => ({
    message: null
  }),
  computed: {
    ...mapGetters(['messages'])
  },
  methods: {
    ...mapActions(['sendMessage']),
    newline () {
      this.value = `${this.value}\n`
    },
    triggerSendMessage () {
      console.log('Sending message .... ')

      let msg = {
        timestamp: new Date().toLocaleTimeString(),
        user: 'Mathias',
        message: this.message
      }
      this.$socket.emit('msg', { room: this.roomName, msg: msg })
      this.message = ''
    }
  }
}
</script>
