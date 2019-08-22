<template>
  <v-container>
    <!-- {{currentRoom.name}} -->
    <v-layout>
      <!-- <div v-for="(peer, p) in currentRoom.users" :key="p">
        <VideoStream :user="peer" />
      </div>-->
      <video id="myvideo" width="250" height="250" autoplay></video>
      <video id="othervideo" width="250" height="250" autoplay></video>
      <!-- <VideoStream :user="`ikke`" /> -->
      <!-- <VideoStream :user="`denanderen`" /> -->
      <!-- <Chat/> -->
      <!-- <v-container absolute fluid class="pa-0" fill-height>
          <v-layout column fill-height justify-space-between>
            <v-flex class="scroll" v-autoscroll>
              <ChatMessage :message="message" v-for="(message, index) in messages" :key="index"
                :mine="message.from == user.name" />
            </v-flex>
            <div>
              <v-layout>
                <v-textarea @keydown.enter.exact.prevent @keyup.enter.exact="checkAndSendMessage" :key="chatMessageKey"
                  autofocus label="Message" box v-model="message" append-icon="send" @click:append="checkAndSendMessage"
                  persistent-hint :hint="randomHint" rows="1" auto-grow />
              </v-layout>
            </div>
          </v-layout>
      </v-container>-->
    </v-layout>
  </v-container>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

import VideoStream from '../components/VideoStream'
import Chat from '../components/Chat'
import ChatMessage from '../components/ChatMessage'
import JanusWrapper from '../plugins/janus.videoroom'

export default {
  components: {
    VideoStream,
    Chat
  },
  data: () => ({
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
    var janus = new JanusWrapper(this.roomName)
  },
  methods: {
    ...mapActions(['setCurrentRoom'])
  },
  destroyed () {
    console.log('room destroyed')
  }
}

</script>

<style>
</style>
