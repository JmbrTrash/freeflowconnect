<template>
  <v-container>
    <v-layout text-center wrap>
      <v-navigation-drawer mini-variant app permanent="" class="blue-grey darken-2 rounded" fixed dark>
      <v-toolbar color="primary" class="py-3">

            <!-- <v-icon dark>home</v-icon> -->
        <v-avatar color="white">
          <v-img lazy-src="/kitten.jpg">
          <template v-slot:placeholder>
          <v-icon color="blue-grey darken-2">fas fa-user-astronaut</v-icon>
          </template>
          </v-img>
          <!-- <v-icon color="blue-grey darken-2">fas fa-user-astronaut</v-icon> -->
        </v-avatar>
      </v-toolbar>
      <v-list-item v-for="(room, i) in rooms" :key="i" link @click="clickRoom(room)">
        <!-- <v-list-item-icon>
        </v-list-item-icon> -->
        <v-list-item-content>
          <v-list-item-title class="title text-capitalize" >{{room}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    rooms: ['Wookie', 'woo', "Ivan's cave"]
  }),
  methods: {
    clickRoom (room) {

    }
  }
}
</script>
