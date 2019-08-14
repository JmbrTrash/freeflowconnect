<template>
  <v-container>
    {{currentRoom}} sdfgsdf
    <v-layout style="height:1000000px">
      <div v-for="(peer, p) in peers" :key="p">
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
    peers: [{ name: 'badjas' }, { name: 'cunt' }, { name: 'singlecore' }]
  }),
  computed: {
    ...mapGetters(['currentRoom']),

    roomName () {
      return this.$route.params.roomName
    }
  },
  mounted () {
    console.log('Mounted')
    this.setCurrentRoom(this.roomName)
  },
  methods: {
    ...mapActions(['setCurrentRoom'])
  }
}
</script>

<style>
</style>
