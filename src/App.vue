<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline ">
        <span>FreeFlow</span>
        <span class="font-weight-light">Connect</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text href="https://jimber.org/" target="_blank">
        <span class="mr-2">By Jimber</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <!-- <HelloWorld /> -->
      <RoomList />
      <Room />
    </v-content>
  </v-app>
</template>

<script>
import RoomList from './components/RoomList'
import Room from './components/Room'

export default {
  name: 'App',
  components: {
    RoomList,
    Room
  },
  data: () => ({

  })
}
</script>
