<template>
  <v-container fluid>
    <v-row>
      <v-col md="10">
        hi
      </v-col>
      <v-col md="2">
        <Chat :roomName="roomName" />
      </v-col>
    </v-row>
    <v-layout>
      <div id="videos" style="width: 100%;display: block;">
      </div>
    </v-layout>
      <!-- <v-btn v-on:click="leave">Disconnect from room</v-btn>
      <v-btn v-on:click="join">Connect to room</v-btn>
      <v-btn v-on:click="showUsers">Show users in janus room</v-btn> -->
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import JanusWrapper from '../plugins/janus.videoroom'
import Chat from '../components/Chat'

export default {
  components: {
    Chat
  },
  data: () => ({
    janus: null
  }),
  computed: {
    ...mapGetters(['currentRoom', 'userName']),
    roomName () {
      return this.$route.params.roomName
    }
  },
  mounted () {
    document.title = `FFC - ${this.roomName}`
    console.log('Mounted')
    this.setCurrentRoom(this.roomName)
    this.$socket.emit('joinRoom', { room: this.roomName, user: this.userName })
    this.janus = new JanusWrapper(this.roomName)
    console.log(this.janus)
  },
  methods: {
    leave: function () {
      console.log('We are going to attempt to disconnect.')
      this.janus.disconnect()
      // this.janus.sfutest.hangup()
    },
    join: function () {
      console.log('We are going to attempt to connect.')
      this.janus.connect(this.roomName)
      // this.janus.sfutest.hangup()
    },
    showUsers: function () {
      console.log('showUsers in room ', this.roomName)
      this.janus.showUsers(this.roomName)
    },
    ...mapActions(['setCurrentRoom'])
  },
  destroyed () {
    console.log('room destroyed')
  }
}
</script>

<style>
</style>
