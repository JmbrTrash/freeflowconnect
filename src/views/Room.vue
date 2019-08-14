<template>
  <v-container>
    <!-- {{currentRoom.name}} -->
    <v-layout style="height:1000000px">
      <div v-for="(peer, p) in currentRoom.users" :key="p">
        <VideoStream :user="peer" />
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import VideoStream from '../components/VideoStream'

export default {
  components: {
    VideoStream
  },
  data: () => ({
    // peers: [{ name: 'badjas' }, { name: 'cunt' }, { name: 'singlecore' }]
  }),
  computed: {
    ...mapGetters(['currentRoom', 'userName']),
    roomName () {
      return this.$route.params.roomName
    }
  },
  mounted () {
    console.log('Mounted')
    console.log(document.referrer)
    this.setCurrentRoom(this.roomName)
    this.$socket.emit('joinRoom', { room: this.roomName, user: this.userName })
  },
  methods: {
    ...mapActions(['setCurrentRoom'])
  }
}
</script>

<style>
</style>
