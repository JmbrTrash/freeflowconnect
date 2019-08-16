<template>
  <v-container>
    <!-- {{currentRoom.name}} -->
    <v-layout style="height:1000000px">
      <!-- <div v-for="(peer, p) in currentRoom.users" :key="p">
        <VideoStream :user="peer" />
      </div>-->
      <VideoStream :user="`ikke`" />
      <VideoStream :user="`denanderen`" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import VideoStream from '../components/VideoStream'
import { JimberJanus } from './../plugins/jimberJanus'
// import JanusClient from "janus-videoroom-client";

export default {
  components: {
    VideoStream
  },
  data: () => ({
    // peers: [{ name: 'badjas' }, { name: 'cunt' }, { name: 'singlecore' }]
    jimberJanus: new JimberJanus()
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
    this.jimberJanus.createJanus().then(janus => {
      console.log(janus)
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(stream => {
          console.log('got stuff', stream)
          var hmm = document.getElementById('ikke')
          hmm.srcObject = stream

          this.jimberJanus.createStreamPlugin(janus).then(handle => {
            console.log('created', handle)
          })
        })

      // this.jimberJanus.createStreamPlugin(janus).then( receiver => {
      //   console.log(receiver)
      // });
    })
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
