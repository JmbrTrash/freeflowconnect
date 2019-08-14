<template>
  <v-app>
    <v-app-bar app v-if="$route.name != 'home'">
      <v-toolbar-title class="headline">
        <div v-if="currentRoom">
          <span>{{currentRoom}}</span>
        </div>
        <div v-else>
          <span>FreeFlow</span>
          <span class="font-weight-light">Connect</span>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text href="https://jimber.org/" target="_blank">
        <span class="mr-2">By Jimber</span>
      </v-btn>
    </v-app-bar>

    <RoomList />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RoomList from './components/RoomList'

export default {
  name: 'App',
  components: {
    RoomList
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['currentRoom'])
  },
  methods: {
    ...mapActions(['setCurrentRoom'])
  },
  mounted () {
    this.setCurrentRoom(null)
  }
}
</script>
